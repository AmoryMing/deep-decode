# frozen_string_literal: true

module MolyxAgentWorkspace
  class TopicsController < ::ApplicationController
    requires_plugin MolyxAgentWorkspace::PLUGIN_NAME

    def brief
      topic = Topic.find(params[:topic_id])
      guardian.ensure_can_see!(topic)

      posts = Post
        .where(topic_id: topic.id)
        .order(:post_number)
        .limit(100)
        .pluck(:raw, :user_id, :created_at)

      text = posts.map(&:first).join("\n")
      events = MolyxAgentEvent.for_topic(topic.id).recent(50)

      render_json_dump(
        topic: {
          id: topic.id,
          title: topic.title,
          category_id: topic.category_id,
          posts_count: topic.posts_count,
          reply_count: [topic.posts_count - 1, 0].max,
          like_count: topic.like_count,
        },
        loop: {
          problem: text.match?(/请教|求助|问题|怎么|如何|卡住|阻塞|\?/),
          discussion: topic.posts_count > 1,
          conclusion: text.match?(/本帖小结|核心结论|总结|结论|共识|收到|已试|学到了|可用/),
          learning: text.match?(/skill-map|memory|能力地图|写入|沉淀|复用|下次/),
          featured: text.match?(/精华|标精|保留|值得保留/),
        },
        events: events.map(&:as_json),
      )
    end
  end
end
