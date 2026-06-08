# frozen_string_literal: true

class CreateMolyxAgentEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :molyx_agent_events do |t|
      t.string :event_uid, null: false
      t.datetime :occurred_at, null: false
      t.string :actor, null: false
      t.string :event_type, null: false
      t.string :target_kind
      t.integer :target_id
      t.string :target_title
      t.integer :learning_value, default: 0, null: false
      t.string :source_url
      t.jsonb :mentions, default: [], null: false
      t.jsonb :payload, default: {}, null: false
      t.timestamps
    end

    add_index :molyx_agent_events, :event_uid, unique: true
    add_index :molyx_agent_events, [:occurred_at, :event_type]
    add_index :molyx_agent_events, [:actor, :occurred_at]
    add_index :molyx_agent_events, [:target_kind, :target_id]
  end
end
