'use strict'

const logger = use('App/Logger')
const User = use('App/Models/User')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const SlackService = use('App/Services/SlackService')
const Client = use('Slack/WebClient')

class ApiTicketController {
  /**
   * Returns all ticket under the organization.
   */
  async organizationTickets({ response, request }) {
    try {
      return response.json(
        await request.organization
          .tickets()
          .with('user')
          .fetch()
      )
    } catch (e) {
      return response.status(500).send('Internal Server Error. Please try again.')
    }
  }

  /**
   * Returns all tickets created by a user.
   */
  async userTickets({ response, params }) {
    try {
      const user = await User.query()
        .where('external_id', params.user_id)
        .first()

      return response.json(await user.tickets().fetch())
    } catch (e) {
      logger.error(`Unable to get user tickets for user_id: ${params.user_id}. \n${e}`)
      return response.status(500).send('Internal Server Error. Please try again.')
    }
  }

  /**
   * Create a ticket with the provided external_id from Slack. If no user is found, the applications will
   * create a user by fetching user information from Slack.
   */
  async create({ request, response }) {
    try {
      const { user_id, title, body } = request.post()

      let user = await User.query()
        .where('external_id', user_id)
        .first()

      if (!user) {
        const client = Client.create()
        user = SlackService.findOrCreateUser(client, request.organization, user_id)
      }

      let ticket = null
      try {
        ticket = await Ticket.create({
          user_id: user.id,
          title: title
        })
      } catch (err) {
        logger.error(`Unable to create tickets for user_id: ${user_id}. \n${err}`)
      }

      try {
        await Message.create({
          user_id: user.id,
          ticket_id: ticket.id,
          body: body
        })
      } catch (err) {
        logger.error(`Unable to create new message for ticket: ${ticket} for user: ${user_id}. \n${err}`)
      }

      return response.status(200).send({
        ok: true
      })
    } catch (e) {
      return response.status(500).send('Internal Server Error. Please try again.')
    }
  }

  /**
   * Get a ticket with all messages belonging to it. Messages will have the user who created the message attached to it.
   */
  async ticket({ response, params }) {
    try {
      return response.json(
        await Ticket.query()
          .where('id', params.ticket_id)
          .with('messages.user')
          .first()
      )
    } catch (e) {
      return response.status(500).send('Internal Server Error. Please try again.')
    }
  }
}

module.exports = ApiTicketController
