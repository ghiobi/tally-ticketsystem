const Mail = use('Mail')

class EmailService {
  async sendEmail(subject, view, data) {
    await Mail.send(view, data, (message) => {
      message.to(data.user.email)
      message.subject(subject)
    })
  }

  //call this when a ticket is created
  async sendTicketConfirmation(ticket) {
    let subject = 'Tally Ticket Confirmation'
    let view = 'emails.ticket-confirmation-email'
    let user = await ticket.user()
    let message = await ticket.messages().first() //get the users's message
    let data = { ticket, user, message }
    await this.sendEmail(subject, view, data)
  }

  //call this when an admin replies
  async sendReplyNotification(ticket) {
    let subject = 'Tally Ticket Reply'
    let view = 'emails.reply-notification-email'
    let user = await ticket.user()
    let message = await ticket.messages().max('create_at') //get the most recent message
    let data = { ticket, user, message }
    await this.sendEmail(subject, view, data)
  }
}

module.exports = EmailService
