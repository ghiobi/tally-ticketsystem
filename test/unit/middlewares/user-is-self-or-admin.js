'use strict'
const sinon = require('sinon')

const { test, before, beforeEach } = use('Test/Suite')(
  'Get User Tickets Access'
)
const { UserFactory } = models
const Factory = use('Factory')

const IsSelfOrAdmin = use('App/Middleware/IsSelfOrAdmin')

let user1 = null
let user2 = null
let ticket1 = null
let ticket2 = null

let next = null
let handle = null
let middleware = null

before(async () => {
  user1 = await UserFactory.make()
  user2 = await UserFactory.make()

  ticket1 = await Factory.model('App/Models/Ticket').make()
  ticket2 = await Factory.model('App/Models/Ticket').make()

  await ticket1.user().associate(user1)
  await ticket2.user().associate(user2)

  next = sinon.fake()

  handle = {
    response: {
      redirect: sinon.fake()
    },
    auth: {
      user: null
    },
    params: {
      userId: user1.id
    }
  }

  middleware = new IsSelfOrAdmin()
})

beforeEach(async () => {
  handle.response.redirect = sinon.fake()
})

test('check if the middleware allows a users to see their own tickets', async ({
  assert
}) => {
  handle.auth.user = user1
  await middleware.handle(handle, next)
  assert.isFalse(handle.response.redirect.called)
})

test('check if the middleware prevents a users to see tickets opened by others', async ({
  assert
}) => {
  handle.auth.user = user2
  await middleware.handle(handle, next)
  assert.isTrue(handle.response.redirect.called)
})

test("check if the middleware allows an admin to see a user's tickets", async ({
  assert
}) => {
  await user2.setRole('admin')
  handle.auth.user = user2
  assert.isFalse(handle.response.redirect.called)
})
