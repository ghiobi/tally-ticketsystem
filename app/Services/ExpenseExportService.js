const json2csv = use('json2csv')
const Drive = use('Drive')

class ExpenseExportService {
  async exportCSV(ticket) {
    return 'csv'
  }

  async exportPDF(ticket) {
    return 'pdf'
  }

  async exportJSON(ticket) {
    const filepath = 'ticket_' + ticket.id + '.json'
    const exists = await Drive.exists(filepath)
    if (exists) {
      return filepath
    } else {
      await Drive.put(filepath, JSON.stringify(ticket))
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
