'use strict'

const User = use('App/Models/User')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const SlackService = use('App/Services/SlackService')
const Client = use('Slack/WebClient')

class ApiTicketController {
  /**
   * Returns all ticket under the organization.
   */
  async organizationTickets({ response, request }) {
    return response.json(
      await request.organization
        .tickets()
        .with('user')
        .fetch()
    )
  }

  /**
   * Returns all tickets created by a user.
   */
  async userTickets({ response, params }) {
    const user = await User.find(params.user_id)

    return response.json(await user.tickets().fetch())
  }

  /**
   * Create a ticket with the provided external_id from Slack. If no user is found, the applications will
   * create a user by fetching user information from Slack.
   */
  async create({ request, response }) {
    const { user_id, title, body } = request.post()

    let user = await User.query()
      .where('external_id', user_id)
      .first()

    if (!user) {
      const client = Client.create()
      user = SlackService.findOrCreateUser(
        client,
        request.organization,
        user_id
      )
    }

    const ticket = await Ticket.create({
      user_id: user.id,
      title: title
    })

    await Message.create({
      user_id: user.id,
      ticket_id: ticket.id,
      body: body
    })

    return response.status(200).send({
      ok: true
    })
  }

  /**
   * Get a ticket with all messages belonging to it. Messages will have the user who created the message attached to it.
   */
  async ticket({ response, params }) {
    return response.json(
      await Ticket.query()
        .where('id', params.ticket_id)
        .with('messages.user')
        .first()
    )
  }
}

module.exports = ApiTicketController
