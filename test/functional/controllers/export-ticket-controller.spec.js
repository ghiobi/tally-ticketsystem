'use strict'

const { test, trait, before } = use('Test/Suite')('Export Ticket Controller')
const { OrganizationFactory, UserFactory, TicketFactory, Ticket, MessageFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user = null
let ticket1 = null
let ticket2 = null
let admin = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'ticket-export-controller-test'
  })

  user = await UserFactory.make({
    email: 'ticket-export-controller-test@email.com',
    password: 'password'
  })

  admin = await UserFactory.create({
    email: 'ticket-export-controller-test-admin@email.com',
    password: 'password'
  })

  await admin.setRole('admin')

  await organization.users().save(user)
  await organization.users().save(admin)

  ticket1 = await TicketFactory.make()
  await ticket1.user().associate(user)

  ticket2 = await TicketFactory.make()
  await ticket2.user().associate(admin)

  await MessageFactory.create({ ticket_id: ticket1.id, user_id: user.id })
  await MessageFactory.create({ ticket_id: ticket1.id, user_id: admin.id })
  await MessageFactory.create({ ticket_id: ticket2.id, user_id: admin.id })
})

test('Assert 500 if download type not specified', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ ticket: ticket1.id })
    .loginVia(admin)
    .end()

  response.assertStatus(500)
})

test('Assert 500 if no tickets specified', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ type: 'CSV' })
    .loginVia(admin)
    .end()

  response.assertStatus(500)
})

test('Assert can export as pdf', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ type: 'PDF', ticket: ticket1.id })
    .loginVia(admin)
    .end()

  response.assertStatus(200)
  response.assertHeader('content-type', 'application/pdf')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + ticket1.id + '].pdf"')
})

test('Assert can export as csv', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ type: 'CSV', ticket: ticket1.id })
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertHeader('content-type', 'text/csv; charset=UTF-8')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + ticket1.id + '].csv"')
})

test('Assert can export as JSON', async ({ client, assert }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ type: 'JSON', ticket: ticket1.id })
    .loginVia(admin)
    .end()

  response.assertStatus(200)
  response.assertHeader('content-type', 'application/json; charset=UTF-8')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + ticket1.id + '].json"')
  assert.include(response.text, '"id": ' + ticket1.id)
  assert.include(response.text, '"user_id": ' + ticket1.user_id)
  assert.include(response.text, '"title": "' + ticket1.title + '"')
  assert.include(response.text, '"status": "' + ticket1.status + '"')
})

test('Assert can export as YAML', async ({ client, assert }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ type: 'YAML', ticket: ticket1.id })
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertHeader('content-type', 'text/yaml; charset=UTF-8')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + ticket1.id + '].yml"')
  assert.include(response.text, 'id: ' + ticket1.id)
  assert.include(response.text, 'user_id: ' + ticket1.user_id)
  assert.include(response.text, 'title: ' + ticket1.title)
  assert.include(response.text, 'status: ' + ticket1.status)
})

test('Assert a non-admin user cannot export tickets that do not belong to him', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ type: 'YAML', ticket: ticket2.id })
    .loginVia(user)
    .end()

  response.assertStatus(500)
})

test('Assert a admin user can export tickets that belong to anyone in the organization', async ({ client, assert }) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ type: 'JSON', ticket: [ticket1.id, ticket2.id] })
    .loginVia(admin)
    .end()

  response.assertStatus(200)
  response.assertHeader('content-type', 'application/json; charset=UTF-8')
  response.assertHeader(
    'content-disposition',
    'attachment; filename="ticket_[' + ticket1.id + ',' + ticket2.id + '].json"'
  )

  const response_data = JSON.parse(response.text)
  assert.equal(response_data.length, 2)
  assert.equal(response_data[0].id, ticket1.id)
  assert.equal(response_data[1].id, ticket2.id)
})

test('Assert a non-admin user can include non-existent or non-premissible tickets in his request and only return the tickets that belong to him', async ({
  client,
  assert
}) => {
  const response = await client
    .post(`organization/${organization.slug}/ticket/export`)
    .send({ type: 'JSON', ticket: [ticket1.id, ticket2.id] })
    .loginVia(user)
    .end()

  response.assertStatus(200)
  response.assertHeader('content-type', 'application/json; charset=UTF-8')
  response.assertHeader('content-disposition', 'attachment; filename="ticket_[' + ticket1.id + '].json"')

  const response_data = JSON.parse(response.text)
  assert.equal(response_data.length, 1)
  assert.equal(response_data[0].id, ticket1.id)
})
