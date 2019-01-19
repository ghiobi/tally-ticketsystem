'use strict'

const { test, before } = use('Test/Suite')('Message Model')

const Message = use('App/Models/Message')
const Ticket = use('App/Models/Ticket')
const User = use('App/Models/User')

let ticket = null
let user = null

before(async () => {
  user = await User.create({
    name: 'User One',
    email: 'user@tally.com',
    password: 'abd123'
  })

  ticket = await Ticket.create({
    opened_by: user.id,
    title: 'Test title',
    status: 'submitted'
  })
})

test('check if a message can be inserted', async ({ assert }) => {
  await Message.create({
    user_id: user.id,
    ticket_id: ticket.id,
    body: 'Test body'
  })

  const message = await Message.query()
    .where('user_id', user.id)
    .first()

  assert.isNotNull(message)
})
