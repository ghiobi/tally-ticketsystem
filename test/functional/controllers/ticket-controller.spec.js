'use strict'

const { test, trait, before } = use('Test/Suite')('Ticket Controller')
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
let admin = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'ticket-controller-test'
  })

  user = await UserFactory.make({
    email: 'ticket-controller-test@email.com',
    password: 'password'
  })

  admin = await UserFactory.create({
    email: 'randomRandom@email.com',
    password: 'password'
  })

  await admin.setRole('admin')

  await organization.users().save(user)
  await organization.users().save(admin)

  ticket = await TicketFactory.make()
  await ticket.user().associate(user)
})

test('Make sure user is redirected back after submitting reply', async ({
  client
}) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/reply`)
    .send({ reply: 'test' })
    .loginVia(user)
    .end()

  response.assertRedirect('/')
})

test('Make sure Message is persisted', async ({ client, assert }) => {
  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/reply`)
    .send({ reply: 'ASDFGHJKL' })
    .loginVia(user)
    .end()

  const message = await Message.query()
    .where('body', 'ASDFGHJKL')
    .where('user_id', user.id)
    .first()

  assert.isNotNull(message)
})

test('Make sure Ticket Status is set to replied after admin reply', async ({
  client,
  assert
}) => {
  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/reply`)
    .send({ reply: 'ASDFGHJKL' })
    .loginVia(admin)
    .end()

  const createdTicket = await Ticket.query()
    .where('id', ticket.id)
    .first()

  assert.equal(createdTicket.status, 'replied')
})
