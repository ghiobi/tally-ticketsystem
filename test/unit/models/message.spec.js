'use strict'

const { test, before } = use('Test/Suite')('Message Model')
const { UserFactory, TicketFactory, MessageFactory, Message } = models

let ticket = null
let user = null

before(async () => {
  user = await UserFactory.create()

  ticket = await TicketFactory.create({
    user_id: user.id,
    assigned_to: null
  })
})

test('check if a message can be inserted', async ({ assert }) => {
  const message = await MessageFactory.create({
    user_id: user.id,
    ticket_id: ticket.id
  })

  const inDatabase = await Message.find(message.id)
  assert.exists(inDatabase)
})

test('makes sure the relations return the correct models', async ({ assert }) => {
  const message = await MessageFactory.create({
    user_id: user.id,
    ticket_id: ticket.id
  })

  const writer = await message.user().fetch()
  assert.exists(writer)
  assert.deepEqual(writer, user)

  const fetchedTicket = await message.ticket().fetch()
  assert.exists(fetchedTicket)
  assert.deepEqual(fetchedTicket, ticket)
})
