'use strict'

const Ticket = use('App/Models/Ticket')
const ExportService = use('App/Services/ExpenseExportService')
const Helpers = use('Helpers')

class ExportTicketController {
  async index({ view, auth, request }) {
    let tickets

    if (await auth.user.hasRole('admin')) {
      const { organization } = request
      tickets = await organization
        .tickets()
        .with('assignedTo')
        .with('messages.user')
        .with('user')
        .fetch()
    } else {
      tickets = await Ticket.query()
        .where('user_id', auth.user.id)
        .with('assignedTo')
        .with('messages.user')
        .with('user')
        .fetch()
    }

    return view.render('ticket.export', { tickets: tickets.toJSON() })
  }

  async submit({ request, response, auth }) {
    const requestType = request.input('type')
    let ticketsInput = request.input('ticket')

    if (!requestType || !['PDF', 'CSV', 'JSON', 'YAML'].includes(requestType) || !ticketsInput) {
      return response.status(400).send('Internal Server Error. Please try again.')
    }

    if (!Array.isArray(ticketsInput)) {
      ticketsInput = [ticketsInput]
    }

    let tickets
    if (await auth.user.hasRole('admin')) {
      tickets = await Ticket.query()
        .whereIn('id', ticketsInput)
        .with('assignedTo')
        .with('messages.user')
        .with('user')
        .fetch()
    } else {
      tickets = await Ticket.query()
        .where('user_id', auth.user.id)
        .whereIn('id', ticketsInput)
        .with('assignedTo')
        .with('messages.user')
        .with('user')
        .fetch()
    }

    if (!tickets || tickets.rows.length === 0) {
      return response.status(500).send('Internal Server Error. Please try again.')
    }

    const exportFile = await ExportService.export(tickets, requestType)
    response.attachment(Helpers.tmpPath(exportFile))
    await ExportService.deleteExport(exportFile)
  }
}

module.exports = ExportTicketController
