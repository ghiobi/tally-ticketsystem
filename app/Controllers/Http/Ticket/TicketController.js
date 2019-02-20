'use strict'

const EmailService = use('App/Services/EmailService')
const User = use('App/Models/User')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')

class TicketController {
  async index({ view, params }) {
    const ticket = await Ticket.query()
      .where('id', params.ticket_id)
      .with('assignedTo') // returns messages linked to this ticket
      .with('messages.user') // returns messages linked to this ticket
      .with('user') // returns who submited the ticket
      .first()

    return view.render('ticket.index', { ticket: ticket.toJSON() })
  }

  async reply({ response, request, auth, params }) {
    const ticket = await Ticket.find(params.ticket_id)

    if (ticket.status === 'closed') {
      return response.redirect('back')
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

    if (await auth.user.hasRole('admin')) {
      // Set status to replied
      if (auth.user.id !== ticket.user_id) {
        if (ticket.status !== 'replied') {
          ticket.updateStatus('replied')
        }
        // Notify ticket owner
        EmailService.sendReplyNotification(ticket).then()
      }
    }

    return response.redirect('back')
  }

  async resolve({ response, request, auth, params }) {
    const ticket = await Ticket.find(params.ticket_id)

    if (ticket.status === 'closed') {
      return response.redirect('back')
    }

    await ticket.updateStatus('closed')

    const reply = request.input('reply')
    if (reply) {
      await Message.create({
        user_id: auth.user.id,
        ticket_id: ticket.id,
        body: reply
      })
    }

    // Notify ticket owner
    if (await auth.user.hasRole('admin')) {
      EmailService.sendReplyNotification(ticket).then()
    }

    return response.redirect('back')
  }

  async reopen({ response, auth, params }) {
    const ticket = await Ticket.find(params.ticket_id)

    if (ticket.status !== 'closed') {
      return response.redirect('back')
    }

    await ticket.updateStatus('replied')

    // Notify ticket owner
    if (await auth.user.hasRole('admin')) {
      EmailService.sendReplyNotification(ticket).then()
    }

    return response.redirect('back')
  }

  async assign({ request, response, params }) {
    const ticket = await Ticket.find(params.ticket_id)

    const user = await User.find(request.input('user_id'))

    if (user && user.organization_id !== request.organization.id) {
      return response.redirect('back')
    }

    if (user) {
      await ticket.assignedTo().associate(user)
    } else {
      await ticket.assignedTo().dissociate()
    }

    return response.redirect('back')
  }
}

module.exports = TicketController
