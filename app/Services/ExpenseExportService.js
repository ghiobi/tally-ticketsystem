const json2csv = use('json2csv')
const Drive = use('Drive')
const yaml = require('js-yaml')

class ExpenseExportService {
  async exportCSV(ticket) {
    const filepath = 'ticket_' + ticket.id + '.csv'
    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
    }
  }

  async exportPDF(ticket) {
    const filepath = 'ticket_' + ticket.id + '.pdf'
    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
    }
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
