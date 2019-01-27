'use strict'
const sinon = require('sinon')
const { UserFactory, TicketFactory, OrganizationFactory } = models

const { test, before, beforeEach } = use('Test/Suite')(
  'Feedback belongs to user'
)

const FeedbackBelongsToUser = use('App/Middleware/FeedbackBelongsToUser')
let middleware = null
let next = null
let handle = null

let organization = null
let organization2 = null
let user = null
let user2 = null
let user3 = null
let ticket1 = null
let ticket2 = null
let ticket3 = null

before(async () => {
  next = sinon.fake()
  /**
    Stub data
    */
  organization = await OrganizationFactory.create()
  organization2 = await OrganizationFactory.create()

  // Admin/Owner in organization 1
  user = await UserFactory.create()
  await user.setRole('admin')
  await user.setRole('owner')
  await organization.users().save(user)

  // User in organization 1
  user2 = await UserFactory.create()
  await organization.users().save(user2)

  // User in organization 2
  user3 = await UserFactory.create()
  await organization2.users().save(user3)

  //ticket  by user 1, in organization 1
  ticket1 = await TicketFactory.make()
  await ticket1.user().associate(user)

  //ticket  by user 2, in organization 1
  ticket2 = await TicketFactory.make()
  await ticket2.user().associate(user2)

  //ticket  by user 3, in organization 2
  ticket3 = await TicketFactory.make()
  await ticket3.user().associate(user3)

  handle = {
    response: {
      redirect: sinon.fake()
    },
    auth: {
      user: user2 // user2 is a regular user
    },
    params: {
      feedback_id: null
    }
  }
})

beforeEach(async () => {
  middleware = new FeedbackBelongsToUser()
})

test('Make sure users can only access feedbacks belonging to them', async ({
  assert
}) => {
  //allowed to view tickets that belong to them
  handle.params.feedback_id = ticket2.id
  await middleware.handle(handle, next)
  assert.isTrue(
    next.called,
    'next() was not called when feedback belonged to user'
  )
  next = sinon.fake()
  //not allowed to view tickets not belonging to them
  handle.params.feedback_id = ticket1.id
  await middleware.handle(handle, next)
  assert.isFalse(
    next.called,
    'next() was called when it feedback did not belong to user'
  )
})

test('Make sure admin can access all feedbacks in their organization', async ({
  assert
}) => {
  // allow admin/owner to access any feedback in their organization
  handle.auth.user = user
  handle.params.feedback_id = ticket2.id

  await middleware.handle(handle, next)
  assert.isTrue(
    next.called,
    'next() was not not called even though user is admin'
  )
  next = sinon.fake()

  // disallow admin/owner to access any feedback that is not in their organization
  handle.params.feedback_id = ticket3.id
  await middleware.handle(handle, next)
  assert.isFalse(
    next.called,
    'next() was called even though ticket did not belong to admin organization'
  )
})
