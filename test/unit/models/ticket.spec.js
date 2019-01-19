'use strict'

const { test, before } = use('Test/Suite')('Ticket Model')

const Ticket = use('App/Models/Ticket')
const User = use('App/Models/User')

let user = null
let admin = null

before(async () => {
  user = await User.create({
    name: 'User One',
    email: 'user@tally.com',
    password: 'abd123'
  })

  admin = await User.create({
    name: 'Admin One',
    email: 'admin@tally.com',
    password: 'abd123'
  })
})

test('check if a ticket can be inserted', async ({ assert }) => {
  await Ticket.create({
    opened_by: user.id,
    assigned_to: admin.id,
    title: 'Test title',
    status: 'submitted'
  })

  const ticket = await Ticket.query()
    .where('opened_by', user.id)
    .first()

  assert.isNotNull(ticket)
})

test('check if status can be updated', async ({ assert }) => {
  await Ticket.create({
    opened_by: user.id,
    assigned_to: admin.id,
    title: 'Test title',
    status: 'submitted'
  })

  var ticket = await Ticket.query()
    .where('opened_by', user.id)
    .first()
  await ticket.updateStatus('closed')
  ticket = await Ticket.query()
    .where('opened_by', user.id)
    .first()
  assert.equal(ticket.status, 'closed')
})
