'use strict'

class NewTicketSubmission {
  constructor(ticket) {
    this.ticket = ticket
  }

  get via() {
    return ['broadcast']
  }

  get type() {
    return 'new-ticket-message'
  }

  toJSON() {
    return {
      ticket: this.ticket.toJSON()
    }
  }
}

module.exports = NewTicketSubmission
