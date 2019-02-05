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

  const message = await Message.query()
    .where('body', 'ASDFGHJKL')
    .where('user_id', user.id)
    .first()

  assert.isNotNull(message)
})
