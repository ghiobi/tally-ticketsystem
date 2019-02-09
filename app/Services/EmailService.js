const Mail = use('Mail')

class EmailService {
  async sendEmail(subject, view, data) {
    Mail.send(view, data, (message) => {
      message.to(data.user.email)
      message.subject(subject)
    })
  }

  //call this when a ticket is created
  async sendTicketConfirmation(ticket) {
    let subject = 'Tally Ticket Confirmation'
    let view = 'emails.ticket-confirmation-email'
    await ticket.loadMany({
      user: null,
      messages: (builder) => builder.with('user').pickInverse(1)
    })
    this.sendEmail(subject, view, ticket.toJSON())
  }

  //call this when an admin replies
  async sendReplyNotification(ticket) {
    let subject = 'Tally Ticket Reply'
    let view = 'emails.reply-notification-email'
    await ticket.loadMany({
      user: null,
      messages: (builder) => builder.with('user').pickInverse(1)
    })

    this.sendEmail(subject, view, ticket.toJSON())
  }
}

module.exports = EmailService
