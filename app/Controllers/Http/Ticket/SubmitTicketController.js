'use strict'

const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')

class SubmitTicketController {
  async index({ view }) {
    return view.render('ticket.SubmitPage')
  }

  async submit({ response, request, auth, session }) {
    const title = request.input('title')
    const body = request.input('body')

    if (!title) {
      session.flash({ notification: 'Missing title' })
      return response.redirect('back')
    }

    if (!body) {
      session.flash({ notification: 'Missing body' })
      return response.redirect('back')
    }

    const user = auth.user

    const ticket = await Ticket.create({
      user_id: user.id,
      title: title,
      status: 'submitted'
    })

    await Message.create({
      user_id: user.id,
      ticket_id: ticket.id,
      body: body
    })

    return response.redirect('back')
  }
}

module.exports = SubmitTicketController
