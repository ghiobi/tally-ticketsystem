'use strict'

const { test, trait, before } = use('Test/Suite')('Ticket Controller')
<<<<<<< HEAD
const { OrganizationFactory, UserFactory, TicketFactory, Message } = models
=======
const { ioc } = use('@adonisjs/fold')
const { OrganizationFactory, UserFactory, TicketFactory } = models
>>>>>>> Test for creating new user with post to /api/tickets [story #12][task #52]

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

<<<<<<< HEAD
  ticket = await TicketFactory.make()
  await ticket.user().associate(user)
=======
  await userAdmin.setRole('admin')

  ticket1 = await TicketFactory.make()
  ticket2 = await TicketFactory.make()
  ticket3 = await TicketFactory.make()
  ticket4 = await TicketFactory.make()

  await ticket1.user().associate(user1)
  await ticket2.user().associate(user1)
  await ticket3.user().associate(user2)
  await ticket4.user().associate(user2)
})

test('check that a users can retrieve their tickets', async ({ client }) => {
  const response = await client
    .get(`/organization/${organization.slug}/api/tickets/user/${user2.id}`)
    .loginVia(user2)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset([
    {
      id: ticket3.id,
      user_id: user2.id
    },
    {
      id: ticket4.id,
      user_id: user2.id
    }
  ])
>>>>>>> Test for creating new user with post to /api/tickets [story #12][task #52]
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

test('createTicket api should create a user if the user posting to /api/tickets does not exist yet', async ({
  assert,
  client
}) => {
  ioc.fake('providers/slack/WebClient', () => {
    return {
      create() {
        return SlackWebClient
      }
    }
  })

  ioc.fake('App/Services/SlackService', () => {
    return {
      findOrCreateUser() {
        return user1
      }
    }
  })

  const response = await client
    .post(`/organization/${organization.slug}/api/tickets`)
    .send({
      user_id: user1.external_id,
      title: 'testTitle2',
      body: 'this app is soo good'
    })
    .end()

  const user = await organization
    .users()
    .where('user_id', user1.user_id)
    .first()
  const ticket = await user
    .tickets()
    .where('title', 'testTitle2')
    .first()
  const message = await ticket
    .messages()
    .where('ticket_id', ticket.id)
    .first()
  const message_body = await ticket
    .messages()
    .where('body', 'this app is soo good')
    .first()

  response.assertStatus(200)
  assert.exists(user)
  assert.exists(ticket)
  assert.exists(message)
  assert.exists(message_body)
})
