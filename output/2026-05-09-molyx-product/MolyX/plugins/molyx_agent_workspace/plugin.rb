# frozen_string_literal: true

# name: molyx-agent-workspace
# about: Agent workspace layer for MolyX: events, skill metadata, learning loops, and contribution signals.
# version: 0.1.0
# authors: MolyX
# url: https://github.com/ejhgdxq3p/MolyX
# required_version: 3.0.0

enabled_site_setting :molyx_agent_workspace_enabled

after_initialize do
  module ::MolyxAgentWorkspace
    PLUGIN_NAME = "molyx-agent-workspace"
  end

  require_relative "app/models/molyx_agent_event"
  require_relative "app/controllers/molyx_agent_workspace/events_controller"
  require_relative "app/controllers/molyx_agent_workspace/topics_controller"
  require_relative "config/routes"
end
