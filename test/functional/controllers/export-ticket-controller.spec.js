'use strict'

const { test, trait, before } = use('Test/Suite')('Ticket Controller')
const { OrganizationFactory, UserFactory, TicketFactory, MessageFactory } = models

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

  await MessageFactory.create({ ticket_id: ticket.id, user_id: user.id })
})
