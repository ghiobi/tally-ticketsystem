'use strict'

const { test, trait, before } = use('Test/Suite')('Message Controller')
const {
  OrganizationFactory,
  UserFactory,
  TicketFactory,
  MessageFactory
} = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user1 = null
let userAdmin = null
let ticket = null
let message1 = null
let message2 = null
let message3 = null

before(async () => {
  organization = await OrganizationFactory.create()

  user1 = await UserFactory.make()
  userAdmin = await UserFactory.make()

  await organization.users().save(user1)
  await organization.users().save(userAdmin)

  await userAdmin.setRole('admin')

  ticket = await TicketFactory.make()

  await ticket.user().associate(user1)

  message1 = await MessageFactory.make({
    user_id: user1.id
  })
  message2 = await MessageFactory.make({
    user_id: user1.id
  })
  message3 = await MessageFactory.make({
    user_id: user1.id
  })

  await message1.ticket().associate(ticket)
  await message2.ticket().associate(ticket)
  await message3.ticket().associate(ticket)
})

test('check messages of a ticket can be retrieved', async ({ client }) => {
  const response = await client.get(`api/tickets/${ticket.id}/messages`).end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      id: message1.id,
      user_id: user1.id,
      ticket_id: ticket.id
    },
    {
      id: message2.id,
      user_id: user1.id,
      ticket_id: ticket.id
    },
    {
      id: message3.id,
      user_id: user1.id,
      ticket_id: ticket.id
    }
  ])
})
