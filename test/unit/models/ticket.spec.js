'use strict'

const { test, before } = use('Test/Suite')('Ticket Model')
const { UserFactory, TicketFactory, Ticket } = models

let user = null
let admin = null

before(async () => {
  user = await UserFactory.create()
  admin = await UserFactory.create()
})

test('check if a ticket can be inserted', async ({ assert }) => {
  const ticket = await TicketFactory.create({
    user_id: user.id,
    assigned_to: admin.id,
    status: 'submitted'
  })

  const inDatabase = await Ticket.find(ticket.id)
  assert.exists(inDatabase)
})

test('check if status can be updated', async ({ assert }) => {
  const ticket = await TicketFactory.create({
    user_id: user.id,
    assigned_to: admin.id,
    status: 'submitted'
  })

  await ticket.updateStatus('closed')
  const inDatabase = await Ticket.find(ticket.id)

  assert.equal(inDatabase.status, 'closed')
})

test('makes sure the relations return the correct models', async ({ assert }) => {
  const ticket = await TicketFactory.create({
    user_id: user.id,
    assigned_to: admin.id,
    status: 'submitted'
  })

  const openedByUser = await ticket.user().fetch()
  assert.exists(openedByUser)
  assert.deepEqual(openedByUser, user)

  const assignedToUser = await ticket.assignedTo().fetch()
  assert.exists(assignedToUser)
  assert.deepEqual(assignedToUser, admin)
})
