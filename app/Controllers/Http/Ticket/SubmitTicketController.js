'use strict'

const User = use('App/Models/User')
const Ticket = use('App/Models/Ticket')
const Message = use('App/Models/Message')

class SubmitTicketController {
    async index({ view, params }) {
        return view.render('ticket.index', { ticket: ticket.toJSON() })
      }

    async submit({ response, request }) {
        const { user_id, title, body } = request.post()
        
        let user = await User.query()
        .where('user_id', user_id)
        .first()

        const ticket
        try {
            ticket = await Ticket.create({
            user_id: user.id,
            title: title
          })
        } catch(e) {
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