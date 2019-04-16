const Drive = use('Drive')
const yaml = require('js-yaml')
const PDFDocument = require('pdfkit')
const createCsvWriter = require('csv-writer').createObjectCsvStringifier
class ExpenseExportService {
  async exportCSV(ticket) {
    const filepath = 'ticket_' + ticket.id + '.csv'
    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      ticket = ticket.toJSON()

      const csvWriter = createCsvWriter({
        header: [
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

      let records = []
      ticket.messages.forEach(function(message) {
        records.push({
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

      const csv_output = csvWriter.getHeaderString() + csvWriter.stringifyRecords(records)
      await Drive.put(filepath, csv_output)

      return filepath
    }
  }

  async exportPDF(ticket) {
    const filepath = 'ticket_' + ticket.id + '.pdf'
    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      ticket = ticket.toJSON()

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
      doc.fontSize(24).text('Ticket Report', { lineGap: 2, indent: 5 })
      doc.fontSize(20).text('Ticket #' + ticket.id, { lineGap: 10, indent: 5 })

      //   Ticket Info
      doc.fontSize(14).text('Title: ' + ticket.title)
      doc.fontSize(14).text('User ID: ' + ticket.user_id)
      doc.fontSize(14).text('Assigned to: ' + ticket.assigned_to)
      doc.fontSize(14).text('Status: ' + ticket.status)
      doc.fontSize(14).text('Created: ' + ticket.created_at)
      doc.fontSize(14).text('Last Update: ' + ticket.updated_at, { lineGap: 15 })

      // Messages
      doc.fontSize(20).text('Messages', { lineGap: 15 })

      ticket.messages.forEach(function(message) {
        doc.fontSize(14).text('User: ' + message.user.name)
        doc.fontSize(14).text('Email: ' + message.user.email)
        doc.fontSize(14).text('Message: ' + message.body)
        doc.fontSize(14).text('Date: ' + message.created_at, { lineGap: 10 })
      })

      // Save File
      doc.end()
      await Drive.put(filepath, doc)
    }
    return filepath
  }

  async exportJSON(ticket) {
    const filepath = 'ticket_' + ticket.id + '.json'
    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      await Drive.put(filepath, JSON.stringify(ticket, null, '\t'))
    }
    return filepath
  }

  async exportYAML(ticket) {
    const filepath = 'ticket_' + ticket.id + '.yml'
    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      await Drive.put(filepath, yaml.safeDump(JSON.parse(JSON.stringify(ticket))))
    }
    return filepath
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
}

module.exports = ExpenseExportService
