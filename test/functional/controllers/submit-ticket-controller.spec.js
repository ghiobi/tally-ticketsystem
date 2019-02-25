'use strict'

const { test, trait, before } = use('Test/Suite')('Submit Ticket Controller')
const {
  OrganizationFactory,
  UserFactory,
  TicketFactory,
  Message,
  Ticket
} = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user = null
let ticket = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'submit-ticket-controller-test'
  })

  user = await UserFactory.make({
    email: 'user-submit-ticket@email.com',
    password: 'password'
  })

  await organization.users().save(user)

  ticket = await TicketFactory.make()
  await ticket.user().associate(user)
})

test('Ensure ticket is created after user submits new ticket', async ({
  client,
  assert
}) => {
  await client
    .post(`organization/${organization.slug}/ticket/create`)
    .send({ title: 'Test ticket title', body: 'Random ticket message' })
    .loginVia(user)
    .end()

  const ticket = await Ticket.query()
    .where('title', 'Test ticket title')
    .first()

  assert.exists(ticket)
})

test('Ensure message is created after user submits new ticket', async ({
  client,
  assert
}) => {
  await client
    .post(`organization/${organization.slug}/ticket/create`)
    .send({ title: 'Random Title', body: 'foobar' })
    .loginVia(user)
    .end()

  const message = await Message.query()
    .where('body', 'foobar')
    .where('user_id', user.id)
    .first()

  assert.isNotNull(message)
})

test('Ensure ticket is not created if missing title ', async ({
  client,
  assert
}) => {
  await client
    .post(`organization/${organization.slug}/ticket/create`)
    .send({ body: 'dfaf89s7D(*Adus980D9SAFKNAD;VKDAFA]}{PP{' })
    .loginVia(user)
    .end()

  const message = await Message.query()
    .where('body', 'dfaf89s7D(*Adus980D9SAFKNAD;VKDAFA]}{PP{')
    .first()

  assert.notExists(message)
})

test('Ensure ticket is not created if missing message body', async ({
  client,
  assert
}) => {
  await client
    .post(`organization/${organization.slug}/ticket/create`)
    .send({ title: 'testTicket1' })
    .loginVia(user)
    .end()

  const ticket = await Ticket.query()
    .where('title', 'testTicket1')
    .first()

  assert.notExists(ticket)
})
