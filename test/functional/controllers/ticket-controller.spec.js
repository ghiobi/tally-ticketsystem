'use strict'

const { test, trait, before } = use('Test/Suite')('Ticket Controller')
const { OrganizationFactory, UserFactory, TicketFactory, Message, Ticket } = models

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

test('Make sure user is redirected back after submitting reply', async ({ client }) => {
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

test('Make sure Ticket Status is set to replied after admin reply', async ({ client, assert }) => {
  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/reply`)
    .send({ reply: 'ASDFGHJKL' })
    .loginVia(admin)
    .end()

  const createdTicket = await Ticket.find(ticket.id)

  assert.equal(createdTicket.status, 'replied')
})

test('Make sure ticket cannot be reopened if it isnt already closed', async ({ client, assert }) => {
  const prevTicket = await Ticket.find(ticket.id)

  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/reopen`)
    .loginVia(user)
    .end()

  const newTicket = await Ticket.find(ticket.id)

  assert.notEqual(prevTicket.status, 'closed')
  assert.equal(prevTicket.status, newTicket.status)
})

test('Make sure ticket can be resolved/closed as admin', async ({ client, assert }) => {
  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/resolve`)
    .loginVia(admin)
    .end()

  const currTicket = await Ticket.find(ticket.id)

  assert.equal(currTicket.status, 'closed')
})

test('Make sure ticket cannot close ticket that is already closed', async ({ client, assert }) => {
  const prevTicket = await Ticket.find(ticket.id)

  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/resolve`)
    .loginVia(user)
    .end()

  const newTicket = await Ticket.find(ticket.id)

  assert.equal(prevTicket.status, 'closed')
  assert.equal(prevTicket.status, newTicket.status)
})

test('Make sure ticket cannot reply to ticket that is already closed', async ({ client, assert }) => {
  const prevTicket = await Ticket.find(ticket.id)

  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/reply`)
    .loginVia(user)
    .end()

  const newTicket = await Ticket.find(ticket.id)

  assert.equal(prevTicket.status, 'closed')
  assert.equal(prevTicket.status, newTicket.status)
})

test('Make sure ticket can be reopened as admin or user', async ({ client, assert }) => {
  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/reopen`)
    .loginVia(user)
    .end()

  const currTicket = await Ticket.find(ticket.id)

  assert.equal(currTicket.status, 'replied')
})

test('Make sure a ticket can be assigned to an adminstrator', async ({ client, assert }) => {
  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/assign?user_id=${admin.id}`)
    .loginVia(admin)
    .end()

  const currTicket = await Ticket.find(ticket.id)

  assert.equal(currTicket.assigned_to, admin.id)
})

test('Make sure a ticket can be unassigned', async ({ client, assert }) => {
  await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/assign?user_id=0`)
    .loginVia(admin)
    .end()

  const currTicket = await Ticket.find(ticket.id)

  assert.notExists(currTicket.assigned_to)
})
