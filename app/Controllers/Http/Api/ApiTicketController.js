'use strict'

const User = use('App/Models/User')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const SlackService = use('App/Services/SlackService')
const Client = use('Slack/WebClient')

class ApiTicketController {
  async getOrganizationTickets({ response, request }) {
    return response.json(
      await request.organization
        .tickets()
        .with('user')
        .fetch()
    )
  }

  async getUserTickets({ response, params }) {
    const user = await User.find(params.userId)

    return response.json(await user.tickets().fetch())
  }

  async createTicket({ request, response }) {
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
}

module.exports = ApiTicketController
