'use strict'
const sinon = require('sinon')
const { UserFactory, TicketFactory, OrganizationFactory } = models

const { test, before, beforeEach } = use('Test/Suite')('Ticket belongs to user')

const TicketBelongsToUser = use('App/Middleware/Pageguards/TicketBelongsToUser')

let middleware = null
let next = null
let handle = null

let organization = null
let user = null
let user2 = null
let ticket1 = null
let ticket2 = null

before(async () => {
  next = sinon.fake()
  /**
    Stub data
    */
  organization = await OrganizationFactory.create()

  // Admin/Owner in organization 1
  user = await UserFactory.create()
  await user.setRole('admin')
  await user.setRole('owner')
  await organization.users().save(user)

  // User in organization 1
  user2 = await UserFactory.make()
  await organization.users().save(user2)

  //ticket  by user 1, in organization 1
  ticket1 = await TicketFactory.make()
  await ticket1.user().associate(user)

  //ticket  by user 2, in organization 1
  ticket2 = await TicketFactory.make()
  await ticket2.user().associate(user2)

  handle = {
    request: {
      organization: organization
    },
    auth: {
      user: user2 // user2 is a regular user
    },
    params: {
      ticket_id: null
    }
  }
})

beforeEach(async () => {
  middleware = new TicketBelongsToUser()
})

test('make sure users can only access tickets belonging to them', async ({ assert }) => {
  //allowed to view tickets that belong to them
  handle.params.ticket_id = ticket2.id
  await middleware.handle(handle, next)
  assert.isTrue(next.called, 'next() was not called when ticket belonged to user')
  next = sinon.fake()
  //not allowed to view tickets not belonging to them
  handle.params.ticket_id = ticket1.id

  let pass = true
  try {
    await middleware.handle(handle, next)
    pass = false
  } catch (e) {
    // continue regardless of error
  }
  assert.isOk(pass, 'ticket belongs to user')

  assert.isFalse(next.called, 'next() was called when the ticket did not belong to user')
})

test('make sure admin cannot access guarded tickets', async ({ assert }) => {
  // allow admin/owner to access any ticket in their organization
  handle.auth.user = user
  handle.params.ticket_id = ticket2.id

  try {
    await middleware.handle(handle, next)
  } catch (e) {
    assert.isOk
  }
  assert.isFalse(next.called, 'next() was called when user was admin')
})
