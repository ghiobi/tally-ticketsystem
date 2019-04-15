'use strict'

const EmailService = use('App/Services/EmailService')
const ExportService = use('App/Services/ExpenseExportService')
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

  async download({ request, response, params, session }) {
    const ticket = await Ticket.query()
      .where('id', params.ticket_id)
      .with('assignedTo') // returns messages linked to this ticket
      .with('messages.user') // returns messages linked to this ticket
      .with('user') // returns who submited the ticket
      .first()

    const requestType = request.input('type')

    if (!requestType || !['PDF', 'CSV', 'JSON', 'YAML'].includes(requestType)) {
      session.flash({ fail: 'Invalid Input' })
    } else {
      let exportFile
      if (requestType == 'PDF') {
        exportFile = await ExportService.exportPDF(ticket)
      } else if (requestType == 'CSV') {
        exportFile = await ExportService.exportCSV(ticket)
      } else if (requestType == 'JSON') {
        exportFile = await ExportService.exportJSON(ticket)
      } else {
        exportFile = await ExportService.exportYAML(ticket)
      }

      response.attachment(Helpers.tmpPath(exportFile))
    }
  }
}

module.exports = TicketController
