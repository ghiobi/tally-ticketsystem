const Topic = use('App/Models/Topic')
const TopicMessage = use('App/Models/TopicMessage')
const StatsD = require('../../../../config/statsd')
const logger = use('App/Logger')

class ForumController {
  async index({ view }) {
    const topics = await Topic.query()
      .with('user')
      .fetch()

    return view.render('forum.forum', { topics: topics.toJSON() })
  }

  async topic({ view, params }) {
    const { topic_id } = params

    let data
    try {
      data = await Topic.query()
        .where('id', topic_id)
        .with('user')
        .with('messages.user')
        .first()

      StatsD.increment('forum.topic.get.success')
    } catch (err) {
      StatsD.increment('forum.topic.get.failed')
      logger.error(`Unable to find topic_id: ${topic_id}. \n${err}`)
    }

    return view.render('forum.topic', { topic: data.toJSON() })
  }

  async topicreply({ request, response, auth, params }) {
    const { topic_id } = params

    const reply = request.input('reply')

    try {
      await TopicMessage.create({
        user_id: auth.user.id,
        topic_id: topic_id,
        body: reply
      })
      StatsD.increment('forum.topic.new.reply.success')
    } catch (err) {
      StatsD.increment('forum.topic.new.reply.failed')
      logger.error(`Unable to reply to topic_id: ${topic_id} for user: ${auth.user_id}. \n${err}`)
    }

    return response.redirect('back')
  }

  async createpage({ view }) {
    return view.render('forum.create')
  }

  async create({ params, response }) {
    const { organization } = params

    StatsD.increment('forum.topic.new.create.success')
    return response.redirect(`/organization/${organization}/forum`)
  }
}

module.exports = ForumController
