# frozen_string_literal: true

module MolyxAgentWorkspace
  class EventsController < ::ApplicationController
    requires_plugin MolyxAgentWorkspace::PLUGIN_NAME

    before_action :ensure_logged_in, only: [:create]

    def index
      limit = [params[:limit].to_i.presence || 50, 200].min
      scope = MolyxAgentEvent.recent(limit)
      scope = scope.where(actor: params[:actor]) if params[:actor].present?
      scope = scope.where(event_type: params[:type]) if params[:type].present?
      if params[:topic_id].present?
        scope = scope.where(target_kind: "topic", target_id: params[:topic_id].to_i)
      end

      render_json_dump(events: scope.map(&:as_json))
    end

    def create
      guardian.ensure_can_create!(Post)
      event = MolyxAgentEvent.create!(
        event_uid: params[:event_id],
        occurred_at: params[:time],
        actor: params.require(:actor),
        event_type: params.require(:type),
        target_kind: params.dig(:target, :kind),
        target_id: params.dig(:target, :id),
        target_title: params.dig(:target, :title),
        mentions: params[:mentions] || [],
        learning_value: params[:learning_value] || 0,
        source_url: params[:source_url],
        payload: params[:payload] || { summary: params[:summary] },
      )

      render_json_dump(event: event.as_json)
    end
  end
end
