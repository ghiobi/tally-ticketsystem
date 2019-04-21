'use strict'

const { test, trait, before } = use('Test/Suite')('Ticket Controller')
const { OrganizationFactory, UserFactory, TicketFactory, Message, Ticket } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user = null
let ticket = null
let ticketAdmin = null
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

  ticketAdmin = await TicketFactory.make()
  await ticketAdmin.user().associate(admin)
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

test('Assert response is 500 if download type not specified', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/download`)
    .loginVia(admin)
    .end()

  response.assertStatus(400)
})

test('Assert response is 403 if user tries to access a ticket that does not belong to him', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/${ticketAdmin.id}/download?type=YAML`)
    .loginVia(user)
    .end()

  response.assertStatus(403)
})

test('Make sure user downloads ticket with no redirect and returns YAML file', async ({ client, assert }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/download?type=YAML`)
    .loginVia(user)
    .end()

  // The ticket data may have been overriden by the previous tests. Therefore, get the current ticket
  const currTicket = await Ticket.find(ticket.id)

  response.assertHeader('content-type', 'text/yaml; charset=UTF-8')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + currTicket.id + '].yml"')
  assert.include(response.text, 'id: ' + currTicket.id)
  assert.include(response.text, 'user_id: ' + currTicket.user_id)
  assert.include(response.text, 'title: ' + currTicket.title)
  assert.include(response.text, 'status: ' + currTicket.status)
})

test('Make sure user downloads ticket with no redirect and returns JSON file', async ({ client, assert }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/download?type=JSON`)
    .loginVia(user)
    .end()

  // The ticket data may have been overriden by the previous tests. Therefore, get the current ticket
  const currTicket = await Ticket.find(ticket.id)

  response.assertHeader('content-type', 'application/json; charset=UTF-8')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + currTicket.id + '].json"')
  assert.include(response.text, '"id": ' + currTicket.id)
  assert.include(response.text, '"user_id": ' + currTicket.user_id)
  assert.include(response.text, '"title": "' + currTicket.title + '"')
  assert.include(response.text, '"status": "' + currTicket.status + '"')
})

test('Make sure user downloads ticket with no redirect and returns CSV file', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/download?type=CSV`)
    .loginVia(user)
    .end()

  response.assertHeader('content-type', 'text/csv; charset=UTF-8')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + ticket.id + '].csv"')
})

test('Make sure user downloads ticket with no redirect and returns PDF file', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/${ticket.id}/download?type=PDF`)
    .loginVia(user)
    .end()

  response.assertHeader('content-type', 'application/pdf')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + ticket.id + '].pdf"')
})
