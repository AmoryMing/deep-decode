# frozen_string_literal: true

Discourse::Application.routes.append do
  get "/molyx-agent/events" => "molyx_agent_workspace/events#index"
  post "/molyx-agent/events" => "molyx_agent_workspace/events#create"
  get "/molyx-agent/topics/:topic_id/brief" => "molyx_agent_workspace/topics#brief"
end
