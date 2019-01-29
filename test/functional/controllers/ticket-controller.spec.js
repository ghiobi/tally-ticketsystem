'use strict'

const { test, trait, before } = use('Test/Suite')('Ticket Controller')
const { OrganizationFactory, UserFactory, TicketFactory, Message } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user = null
let ticket = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'ticket-controller-test'
  })

  user = await UserFactory.make({
    email: 'ticket-controller-test@email.com',
    password: 'password'
  })

  await organization.users().save(user)

  ticket = await TicketFactory.make()
  await ticket.user().associate(user)
})

test('Make sure user is redirected back after submitting reply', async ({
  client
}) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}`)
    .send({ reply: 'test' })
    .loginVia(user)
    .end()

  response.assertRedirect('/')
})

test('Make sure Message is persisted', async ({ client, assert }) => {
  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}`)
    .send({ reply: 'ASDFGHJKL' })
    .loginVia(user)
    .end()

<<<<<<< HEAD
  const message = await Message.query()
    .where('body', 'ASDFGHJKL')
    .where('user_id', user.id)
    .first()
=======
  response.assertRedirect('/403')
})

test('check that a user cannot see tickets opened by other users', async ({
  client
}) => {
  const response = await client
    .get(`/organization/${organization.slug}/api/tickets/user/${user2.id}`)
    .loginVia(user1)
    .end()

  response.assertRedirect('/403')
})

test('check that an admin can see tickets belonging to a user', async ({
  client
}) => {
  const response = await client
    .get(`/organization/${organization.slug}/api/tickets/user/${user2.id}`)
    .loginVia(userAdmin)
    .end()
>>>>>>> Add test for post new ticket api [task #52][story #12]

  assert.isNotNull(message)
})

test('createTicket api should create a new ticket and message in the database', async ({
  assert,
  client
}) => {
  const response = await client
    .post(`/organization/${organization.slug}/api/tickets`)
    .loginVia(user1)
    .send({
      user_id: user1.external_id,
      title: 'testTitle',
      body: 'this app is not good'
    })
    .end()

  const ticket = await user1
    .tickets()
    .where('title', 'testTitle')
    .first()
  const message = await ticket
    .messages()
    .where('ticket_id', ticket.id)
    .first()
  const message_body = await ticket
    .messages()
    .where('body', 'this app is not good')
    .first()

  response.assertStatus(200)
  assert.exists(ticket)
  assert.exists(message)
  assert.exists(message_body)
})

test('')
