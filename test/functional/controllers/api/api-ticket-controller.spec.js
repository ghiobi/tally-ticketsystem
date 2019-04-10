'use strict'

const { test, trait, before } = use('Test/Suite')('Api Ticket Controller')
const { ioc } = use('@adonisjs/fold')
const { OrganizationFactory, UserFactory, User, TicketFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user1 = null
let user2 = null
let userAdmin = null
let ticket1 = null
let ticket2 = null
let ticket3 = null
let ticket4 = null
let wrongOrganization = 'wrongOrganization'

before(async () => {
  organization = await OrganizationFactory.create({
    api_token: 'someRandomAPIToken'
  })

  user1 = await UserFactory.make()
  user2 = await UserFactory.make()
  userAdmin = await UserFactory.make()

  await organization.users().save(user1)
  await organization.users().save(user2)
  await organization.users().save(userAdmin)

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

test('check if all tickets from an organization can be retrieved', async ({ client }) => {
  const response = await client
    .get(`/organization/${organization.slug}/api/tickets?token=${organization.api_token}`)
    .loginVia(userAdmin)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      id: ticket1.id
    },
    {
      id: ticket2.id
    },
    {
      id: ticket3.id
    },
    {
      id: ticket4.id
    }
  ])
})

test('check that tickets belonging to a user can be retrieved', async ({ client }) => {
  const response = await client
    .get(`organization/${organization.slug}/api/tickets/user/${user2.external_id}?token=${organization.api_token}`)
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
})

test('check that a wrong token prevents from retrieving all tickets', async ({ client }) => {
  const response = await client.get(`/organization/${organization.slug}/api/tickets?token=${wrongOrganization}`).end()

  response.assertStatus(403)
})

test('check that a wrong token prevents from retrieving tickets belonging to a user', async ({ client }) => {
  const response = await client
    .get(`organization/${organization.slug}/api/tickets/user/${user2.external_id}?token=${wrongOrganization}`)
    .end()

  response.assertStatus(403)
})

test('createTicket api should create a new ticket and message in the database', async ({ assert, client }) => {
  const response = await client
    .post(`/organization/${organization.slug}/api/tickets`)
    .send({
      token: organization.api_token,
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
  const SlackWebClient = {}
  ioc.fake('Slack/WebClient', () => {
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
      token: organization.api_token,
      user_id: user1.external_id,
      title: 'testTitle2',
      body: 'this app is soo good'
    })
    .end()

  const user = await User.find(user1.id)

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
