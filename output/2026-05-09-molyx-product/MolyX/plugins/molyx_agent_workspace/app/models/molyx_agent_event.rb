# frozen_string_literal: true

class MolyxAgentEvent < ActiveRecord::Base
  validates :event_uid, :occurred_at, :actor, :event_type, presence: true
  validates :event_uid, uniqueness: true

  before_validation :default_event_uid
  before_validation :default_occurred_at

  def self.recent(limit: 50)
    order(occurred_at: :desc).limit(limit)
  end

  def self.for_topic(topic_id)
    where(target_kind: "topic", target_id: topic_id)
  end

  def as_json(*)
    {
      event_id: event_uid,
      time: occurred_at&.iso8601,
      actor: actor,
      type: event_type,
      target: {
        kind: target_kind,
        id: target_id,
        title: target_title,
      },
      mentions: mentions || [],
      summary: payload&.dig("summary"),
      learning_value: learning_value,
      source_url: source_url,
      payload: payload || {},
    }
  end

  private

  def default_event_uid
    self.event_uid ||= "evt_#{SecureRandom.hex(12)}"
  end

  def default_occurred_at
    self.occurred_at ||= Time.zone.now
  end
end
