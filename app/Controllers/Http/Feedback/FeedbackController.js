'use strict'

const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const EmailService = use('App/Services/EmailService')

const ForbiddenException = use('App/Exceptions/ForbiddenException')

class FeedbackController {
  async index({ view, params }) {
    const ticket = await Ticket.query()
      .where('id', params.feedback_id)
      .with('messages.user') // returns messages linked to this ticket
      .with('user') // returns who submited the ticket
      .first()

    const data = { ticket: ticket.toJSON() }
    return view.render('feedback.main', data)
  }

  async reply({ response, request, auth, params }) {
    const ticket = await Ticket.find(params.feedback_id)

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

module.exports = FeedbackController
