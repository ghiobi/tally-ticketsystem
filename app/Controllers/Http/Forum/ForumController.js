const Topic = use('App/Models/Topic')
const TopicMessage = use('App/Models/TopicMessage')

class ForumController {
  async index({ view }) {
    const topics = await Topic.query()
      .with('user')
      .fetch()

    return view.render('forum.forum', { topics: topics.toJSON() })
  }

  async topic({ view, params }) {
    const { topic_id } = params

    const data = await Topic.query()
      .where('id', topic_id)
      .with('user')
      .with('messages.user')
      .first()

    return view.render('forum.topic', { topic: data.toJSON() })
  }

  async topicreply({ request, response, auth, params }) {
    const { topic_id } = params

    const reply = request.input('reply')

    await TopicMessage.create({
      user_id: auth.user.id,
      topic_id: topic_id,
      body: reply
    })
    return response.redirect('back')
  }

  async createpage({ view }) {
    return view.render('forum.create')
  }
  async create({ params, response }) {
    const { organization } = params

    return response.redirect(`/organization/${organization}/forum`)
  }
}

module.exports = ForumController
