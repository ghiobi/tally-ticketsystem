'use strict'
const sinon = require('sinon')

const { test, before, beforeEach } = use('Test/Suite')('User Is Admin')
const { OrganizationFactory, UserFactory } = models

const IsAdmin = use('App/Middleware/IsAdmin')

let organization = null
let user = null
let admin = null

let next = null
let handle = null
let middleware = null

before(async () => {
  organization = await OrganizationFactory.create()
  user = await UserFactory.make()
  admin = await UserFactory.make()

  await organization.users().save(user)
  await organization.users().save(admin)

  await admin.setRole('admin')

  handle = {
    response: {},
    auth: {
      user: null
    }
  }

  middleware = new IsAdmin()
})

beforeEach(async () => {
  next = sinon.fake()
  handle.response.redirect = sinon.fake()
})

test('check if middleware prevents users from see organization tickets', async ({
  assert
}) => {
  handle.auth.user = user

  let pass = true
  try {
    await middleware.handle(handle, next)
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'middleware did not prevent user from accessing resource')
  assert.isFalse(next.called)
})

test('check if the middleware allows admins to see organization tickets', async ({
  assert
}) => {
  handle.auth.user = admin
  await middleware.handle(handle, next)

  assert.isFalse(handle.response.redirect.called)
  assert.isTrue(next.called)
})
