'use strict'

const { test, before } = use('Test/Suite')('Tickets Service')
const { UserFactory, OrganizationFactory, TicketFactory } = models

const TicketsService = use('App/Services/TicketsService')

let user = null
let organization = null
let ticket = null
let ticket2 = null
before(async () => {
  organization = await OrganizationFactory.create()
  user = await UserFactory.create()
  await organization.users().save(user)
  const user2 = await UserFactory.create()
  await organization.users().save(user2)

  /**
    Stub tickets
   */
  ticket = await TicketFactory.make()
  ticket.user().associate(user)

  ticket2 = await TicketFactory.make()
  ticket2.user().associate(user2)
})

test('getOrganizationTickets', async ({ assert }) => {
  const tickets = (await TicketsService.getOrganizationTickets(user)).toJSON()
  /**
    format some fields
   */
  let userId = tickets[0].user.id
  delete tickets[0].user
  tickets[0].user_id = userId

  userId = tickets[1].user.id
  delete tickets[1].user
  tickets[1].user_id = userId

  ticket.assigned_to = null
  ticket2.assigned_to = null

  assert.deepEqual(tickets, [ticket.toJSON(), ticket2.toJSON()])
})

test('getUserTickets', async ({ assert }) => {
  const tickets = (await TicketsService.getUserTickets(
    user.toJSON().id
  )).toJSON()

  assert.deepEqual(tickets, [ticket.toJSON()])
})
