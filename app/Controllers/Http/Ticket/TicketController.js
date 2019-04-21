'use strict'

const logger = use('App/Logger')
const EmailService = use('App/Services/EmailService')
const ExportService = use('App/Services/ExpenseExportService')
const NewTicketMessage = use('App/Notifications/NewTicketMessage')
const User = use('App/Models/User')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const Helpers = use('Helpers')

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

    try {
      const reply = request.input('reply')
      if (!reply) {
        return response.redirect('back')
      }

      await Message.create({
        user_id: auth.user.id,
        ticket_id: ticket.id,
        body: reply
      })
    } catch (err) {
      logger.error(`Unable to submit reply for ticket: ${ticket}. \n${err}`)
    }

    if (await auth.user.hasRole('admin')) {
      // Set status to replied
      if (auth.user.id !== ticket.user_id) {
        if (ticket.status !== 'replied') {
          ticket.updateStatus('replied')
        }
        // Notify ticket owner
        const user = await ticket.user().fetch()
        user.notify(new NewTicketMessage(ticket))

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

    try {
      await ticket.updateStatus('closed')
    } catch (err) {
      logger.error(`Unable to resolve ticket: ${ticket}. \n${err}`)
    }

    try {
      const reply = request.input('reply')
      if (reply) {
        await Message.create({
          user_id: auth.user.id,
          ticket_id: ticket.id,
          body: reply
        })
      }
    } catch (err) {
      logger.error(`Unable to submit reply for ticket: ${ticket}. \n${err}`)
    }

    // Notify ticket owner
    if (await auth.user.hasRole('admin')) {
      try {
        EmailService.sendReplyNotification(ticket).then()
      } catch (err) {
        logger.error(`Unable to send reply notification to admin for ticket: ${ticket}. \n${err}`)
      }
    }

    return response.redirect('back')
  }

  async reopen({ response, auth, params }) {
    const ticket = await Ticket.find(params.ticket_id)

    if (ticket.status !== 'closed') {
      return response.redirect('back')
    }

    try {
      await ticket.updateStatus('replied')
    } catch (err) {
      logger.error(`Unable to update status of ticket: ${ticket}. \n${err}`)
    }

    // Notify ticket owner
    if (await auth.user.hasRole('admin')) {
      try {
        EmailService.sendReplyNotification(ticket).then()
      } catch (err) {
        logger.error(`Unable to send reply notifications of ticket: ${ticket}. \n${err}`)
      }
    }

    return response.redirect('back')
  }

  async assign({ request, response, params }) {
    const ticket = await Ticket.find(params.ticket_id)

    const user = await User.find(request.input('user_id'))

    if (user && user.organization_id !== request.organization.id) {
      return response.redirect('back')
    }

    try {
      if (user) {
        await ticket.assignedTo().associate(user)
      } else {
        await ticket.assignedTo().dissociate()
      }
    } catch (err) {
      logger.error(`Unable to assign ticket: ${ticket}. \n${err}`)
    }

    return response.redirect('back')
  }

  async download({ request, response, params, auth }) {
    const requestType = request.input('type')
    if (!requestType || !['PDF', 'CSV', 'JSON', 'YAML'].includes(requestType)) {
      return response.status(400).send('Internal Server Error. Please try again.')
    }

    let ticket
    if (await auth.user.hasRole('admin')) {
      ticket = await Ticket.query()
        .where('id', params.ticket_id)
        .with('assignedTo')
        .with('messages.user')
        .with('user')
        .fetch()
    } else {
      ticket = await Ticket.query()
        .where('user_id', auth.user.id)
        .where('id', params.ticket_id)
        .with('assignedTo')
        .with('messages.user')
        .with('user')
        .fetch()
    }

    if (!ticket || ticket.rows.length === 0) {
      return response.status(500).send('Internal Server Error. Please try again.')
    }

    const exportFile = await ExportService.export(ticket, requestType)
    await response.attachment(Helpers.tmpPath(exportFile))
    await ExportService.deleteExport(exportFile)
  }

  async rate({ response, params, session }) {
    const ticket = await Ticket.find(params.ticket_id)
    const rating = params.rating
    let validRating = true
    if (rating < 1 || rating > 5) {
      validRating = false
    }

    if (ticket.status !== 'closed' || !validRating) {
      return response.redirect('back')
    }

    try {
      await ticket.updateRating(parseInt(rating, 10))
    } catch (err) {
      logger.error(`Unable to rate ticket: ${ticket}. \n${err}`)
    }

    session.flash({ success: 'Thank you for you valuable feedback!' })
    return response.redirect('back')
  }
}

module.exports = TicketController
