'use strict'

const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')
const InternalServerErrorException = use(
  'App/Exceptions/InternalServerErrorException'
)

class SubmitTicketController {
  async index({ view }) {
    return view.render('ticket.SubmitPage')
  }

  async submit({ response, request, auth }) {
    const title = request.input('title')
    const body = request.input('body')

    const user = auth.user

    const ticket = await Ticket.create({
      user_id: user.id,
      title: title,
      status: 'submitted'
    })

    if (ticket) {
      const message = await Message.create({
        user_id: user.id,
        ticket_id: ticket.id,
        body: body
      })
    } else {
      throw new InternalServerErrorException()
    }

    return response.redirect('back')
  }
}

module.exports = SubmitTicketController
