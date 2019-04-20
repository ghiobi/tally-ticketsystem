const logger = use('App/Logger')
const Mail = use('Mail')
const Helpers = use('Helpers')
const Config = use('Config')
const appUrl = Config.get('app.appUrl')

class EmailService {
  async sendEmail(subject, view, data) {
    try {
      data.appUrl = appUrl
      Mail.send(view, data, (message) => {
        message.to(data.user.email)
        message.subject(subject)
        message.embed(Helpers.publicPath('/images/logo.png'), 'logo')
      })
    } catch (err) {
      logger.error(`Unable to send email to user ${data.user} (email: ${data.user.email}. \n${err})`)
    }
  }

  //call this when a ticket is created
  async sendTicketConfirmation(ticket) {
    let subject = 'Tally Ticket Confirmation'
    let view = 'emails.ticket-confirmation-email'
    try {
      await ticket.loadMany({
        user: (builder) => builder.with('organization'),
        messages: (builder) => builder.with('user').pickInverse(1)
      })
    } catch (err) {
      logger.error(`Unable to send ticket confirmation for user: ${ticket.user} ticket: ${ticket}. \n${err}`)
    }

    this.sendEmail(subject, view, ticket.toJSON())
  }

  //call this when an admin replies
  async sendReplyNotification(ticket) {
    let subject = 'Tally Ticket Reply'
    let view = 'emails.reply-notification-email'
    try {
      await ticket.loadMany({
        user: (builder) => builder.with('organization'),
        messages: (builder) => builder.with('user').pickInverse(1)
      })
    } catch (err) {
      logger.error(`Unable to send reply notification for user: ${ticket.user} ticket: ${ticket}. \n${err}`)
    }

    this.sendEmail(subject, view, ticket.toJSON())
  }

  async sendTokenToResetPassword(user, token) {
    let subject = 'Tally Ticket - Recover Password'
    let view = 'emails.reset-password'
    this.sendEmail(subject, view, { user, token })
  }
}

module.exports = EmailService
