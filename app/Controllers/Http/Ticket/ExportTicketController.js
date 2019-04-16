'use strict'

const Ticket = use('App/Models/Ticket')
const ExportService = use('App/Services/ExpenseExportService')
const Helpers = use('Helpers')

class ExportTicketController {
  async index({ view, auth, request }) {
    let tickets

    if (auth.user.hasRole('admin')) {
      let { organization } = request
      tickets = await organization
        .tickets()
        .with('assignedTo')
        .with('messages.user')
        .with('user')
        .fetch()
    } else {
      tickets = await Ticket.query()
        .where('user_id', auth.user.id)
        .with('assignedTo') // returns messages linked to this ticket
        .with('messages.user') // returns messages linked to this ticket
        .with('user') // returns who submited the ticket
        .fetch()
    }

    return view.render('ticket.export', { tickets: tickets.toJSON() })
  }

  async submit({ request, response, session }) {
    const requestType = request.input('type')
    let ticketsInput = request.input('ticket')

    if (!requestType || !['PDF', 'CSV', 'JSON', 'YAML'].includes(requestType)) {
      session.flash({ fail: 'Invalid Export Type' })
      response.redirect('back')
    }
    if (ticketsInput) {
      if (!Array.isArray(ticketsInput)) {
        ticketsInput = [ticketsInput]
      }
      const tickets = await Ticket.query()
        .whereIn('id', ticketsInput)
        .with('assignedTo') // returns messages linked to this ticket
        .with('messages.user') // returns messages linked to this ticket
        .with('user') // returns who submited the ticket
        .fetch()

      let exportFile
      if (requestType === 'PDF') {
        exportFile = await ExportService.exportPDF(tickets)
      } else if (requestType === 'CSV') {
        exportFile = await ExportService.exportCSV(tickets)
      } else if (requestType === 'JSON') {
        exportFile = await ExportService.exportJSON(tickets)
      } else {
        exportFile = await ExportService.exportYAML(tickets)
      }

      response.attachment(Helpers.tmpPath(exportFile))

      await ExportService.deleteExport(exportFile)
    }

    session.flash({ success: 'No tickets were selected to download' })
  }
}

module.exports = ExportTicketController
