'use strict'

const User = use('App/Models/User')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')

class SubmitTicketController {
  async index({ view }) {
    return view.render('ticket.SubmitPage')
  }

  async submit({ response, request, auth }) {
    const { title, body } = request.post()

    const user = auth.user

    let ticket = null
    try {
      ticket = await Ticket.create({
        user_id: user.id,
        title: title
      })
    } catch (e) {
      return response.redirect('back', 501)
    }

    await Message.create({
      user_id: user.id,
      ticket_id: ticket.id,
      body: body
    })

    return response.redirect('back', 200)
  }
}

module.exports = SubmitTicketController
