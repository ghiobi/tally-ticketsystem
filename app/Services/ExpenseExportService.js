const Drive = use('Drive')
const yaml = require('js-yaml')
const PDFDocument = require('pdfkit')
const createCsvWriter = require('csv-writer').createObjectCsvStringifier
class ExpenseExportService {
  async exportCSV(tickets) {
    tickets = tickets.toJSON()
    var filename_ids = tickets.map((ticket) => ticket.id)
    const filepath = 'ticket_' + JSON.stringify(filename_ids) + '.csv'

    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      // Insert CSV Headers
      const csvWriter = createCsvWriter({
        header: [
          { id: 'ticket_id', title: 'Ticket ID' },
          { id: 'title', title: 'Title' },
          { id: 'user_id', title: 'User ID' },
          { id: 'status', title: 'Status' },
          { id: 'assigned', title: 'Assigned to' },
          { id: 'created', title: 'Created' },
          { id: 'updated', title: 'Updated' },
          { id: 'message', title: 'Message' },
          { id: 'message_user', title: 'Message User' },
          { id: 'message_date', title: 'Message Date' }
        ]
      })

      // Insert CSV Body
      let records = []
      tickets.forEach(function(ticket) {
        this.csvInsertTicket(records, ticket)
      }, this)

      const csv_output = csvWriter.getHeaderString() + csvWriter.stringifyRecords(records)
      await Drive.put(filepath, csv_output)

      return filepath
    }
  }

  async exportPDF(tickets) {
    tickets = tickets.toJSON()
    var filename_ids = tickets.map((ticket) => ticket.id)
    const filepath = 'ticket_' + JSON.stringify(filename_ids) + '.pdf'

    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      // Create a new PDF document
      const doc = new PDFDocument()

      doc.info.Title = 'Ticket Export'
      doc.info.Author = 'Tally'
      doc.info.Subject = 'Tally Export Data'

      // Add Tally Logo
      doc.image('resources/assets/public/images/logo.png', {
        fit: [150, 150],
        indent: -10,
        align: 'center'
      })

      //   Add Title
      doc.fontSize(30).text('Ticket Export', { lineGap: 15, indent: 5 })

      //   Adding the tickets
      tickets.forEach(function(ticket) {
        this.pdfInsertTicket(doc, ticket)
      }, this)

      //   Save File
      doc.end()
      await Drive.put(filepath, doc)
    }
    return filepath
  }

  async exportJSON(tickets) {
    tickets = tickets.toJSON()
    var filename_ids = tickets.map((ticket) => ticket.id)
    const filepath = 'ticket_' + JSON.stringify(filename_ids) + '.json'

    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      await Drive.put(filepath, JSON.stringify(tickets, null, '\t'))
      return filepath
    }
  }

  async exportYAML(tickets) {
    tickets = tickets.toJSON()
    var filename_ids = tickets.map((ticket) => ticket.id)
    const filepath = 'ticket_' + JSON.stringify(filename_ids) + '.yml'

    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      await Drive.put(filepath, yaml.safeDump(JSON.parse(JSON.stringify(tickets))))
      return filepath
    }
  }

  async deleteExport(filepath) {
    const exists = await Drive.exists(filepath)
    if (exists) {
      await Drive.delete(filepath)
      return true
    } else {
      return false
    }
  }

  csvInsertTicket(records, ticket) {
    ticket.messages.forEach(function(message) {
      records.push({
        ticket_id: ticket.id,
        title: ticket.title,
        user_id: ticket.user_id,
        status: ticket.status,
        assigned: ticket.assigned_to,
        created: ticket.created_at,
        updated: ticket.updated_at,
        message: message.body,
        message_user: message.user.name,
        message_date: message.created_at
      })
    })
  }

  pdfInsertTicket(doc, ticket) {
    doc.fontSize(20).text('Ticket #' + ticket.id, { lineGap: 8 })

    //   Ticket Info
    doc.fontSize(14).text('Title: ' + ticket.title)
    doc.fontSize(14).text('User ID: ' + ticket.user_id)
    doc.fontSize(14).text('Assigned to: ' + ticket.assigned_to)
    doc.fontSize(14).text('Status: ' + ticket.status)
    doc.fontSize(14).text('Created: ' + ticket.created_at)
    doc.fontSize(14).text('Last Update: ' + ticket.updated_at, { lineGap: 15 })

    //   Messages
    doc.fontSize(16).text('Messages', { lineGap: 8 })
    ticket.messages.forEach(function(message) {
      doc.fontSize(14).text('User: ' + message.user.name)
      doc.fontSize(14).text('Email: ' + message.user.email)
      doc.fontSize(14).text('Message: ' + message.body)
      doc.fontSize(14).text('Date: ' + message.created_at, { lineGap: 8 })
    })

    doc.moveDown()
  }
}

module.exports = ExpenseExportService
