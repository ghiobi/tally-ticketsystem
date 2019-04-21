'use strict'

const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const EmailService = use('App/Services/EmailService')
const StatsD = require('../../../../config/statsd')

class SubmitTicketController {
  async index({ view }) {
    return view.render('ticket.create')
  }

  async submit({ response, request, auth, session }) {
    const user = auth.user

    const ticket = await Ticket.create({
      user_id: user.id,
      title: request.input('title'),
      status: 'submitted'
    })

    await Message.create({
      user_id: user.id,
      ticket_id: ticket.id,
      body: request.input('body')
    })

    StatsD.increment('ticket.submission.success')

    try {
      await EmailService.sendTicketConfirmation(ticket)
    } catch (error) {
      //TODO: add logging for errors
    }

    session.flash({ success: 'Ticket has been created' })
    return response.redirect('/organization/' + request.organization.slug)
  }
}

module.exports = SubmitTicketController
