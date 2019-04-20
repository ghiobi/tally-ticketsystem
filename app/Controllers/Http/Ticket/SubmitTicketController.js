'use strict'

const logger = use('App/Logger')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const EmailService = use('App/Services/EmailService')

class SubmitTicketController {
  async index({ view }) {
    return view.render('ticket.create')
  }

  async submit({ response, request, auth, session }) {
    const user = auth.user

    let ticket = ''
    try {
      ticket = await Ticket.create({
        user_id: user.id,
        title: request.input('title'),
        status: 'submitted'
      })

      await Message.create({
        user_id: user.id,
        ticket_id: ticket.id,
        body: request.input('body')
      })
    } catch (err) {
      logger.error(`Unable to submit user: ${user} ticket: ${ticket}. \n${err}`)
    }

    try {
      await EmailService.sendTicketConfirmation(ticket)
    } catch (err) {
      logger.error(`Unable to send ticket confirmation for ticket: ${ticket}. \n${err}`)
    }

    session.flash({ success: 'Ticket has been created' })
    return response.redirect('/organization/' + request.organization.slug)
  }
}

module.exports = SubmitTicketController
