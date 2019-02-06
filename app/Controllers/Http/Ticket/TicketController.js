'use strict'

const EmailService = use('App/Services/EmailService')
const ForbiddenException = use('App/Exceptions/ForbiddenException')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')

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
}

module.exports = TicketController
