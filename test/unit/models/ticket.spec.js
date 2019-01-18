'use strict'

const { test, beforeEach } = use('Test/Suite')('Ticket Model')

const Ticket = use('App/Models/Ticket')
const User = use('App/Models/User')

let user = null
let admin = null

beforeEach(async () => {
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
    admin_id: admin.id,
    title: 'Test title',
    status: 'submitted'
  })

  const ticket = await Ticket.query()
    .where('opened_by', user.id)
    .first()

  assert.isNotNull(ticket)
})

test('check if status can be update', async ({ assert }) => {
  await Ticket.create({
    opened_by: user.id,
    admin_id: admin.id,
    title: 'Test title',
    status: 'submitted'
  })

  var ticket = await Ticket.query()
    .where('opened_by', user.id)
    .first()
  ticket.updateStatus('closed')
  assert.equal(ticket.status, 'closed')
})
