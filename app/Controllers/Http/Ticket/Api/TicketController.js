'use strict'

const EmailService = use('App/Services/EmailService')
const ForbiddenException = use('App/Exceptions/ForbiddenException')
const User = use('App/Models/User')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const SlackService = use('App/Services/SlackService')
const Client = use('Slack/WebClient')

class TicketController {
  async index({ view, params }) {
    const ticket = await Ticket.query()
      .where('id', params.ticket_id)
      .with('messages.user') // returns messages linked to this ticket
      .with('user') // returns who submited the ticket
      .first()

    return view.render('ticket.index', { ticket: ticket.toJSON() })
  }

  async reply({ response, request, auth, params }) {
    const ticket = await Ticket.find(params.ticket_id)

    if (
      ticket.user_id !== auth.user.id &&
      !(await auth.user.hasRole('admin'))
    ) {
      throw new ForbiddenException()
    }

    const reply = request.input('reply')
    if (!reply) {
      return response.redirect('back')
    }

    await Message.create({
      user_id: auth.user.id,
      ticket_id: ticket.id,
      body: reply
    })

    // Notify ticket owner
    if (await auth.user.hasRole('admin')) {
      EmailService.sendReplyNotification(ticket)
    }

    return response.redirect('back')
  }

  async createTicket({ request, response }) {
    const { user_id, title, body } = request.post()

    const user = await User.query()
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

module.exports = TicketController
