'use strict'
const sinon = require('sinon')

const { test, before, beforeEach } = use('Test/Suite')(
  'Get Organization Tickets Access'
)
const { OrganizationFactory, UserFactory } = models

const GetOrganizationTicketsAccess = use(
  'App/Middleware/GetOrganizationTicketsAccess'
)

let organization = null
let user = null
let admin = null

let next = null
let handle = null
let middleware = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'middleware-test'
  })
  user = await UserFactory.make()
  admin = await UserFactory.make()

  await organization.users().save(user)
  await organization.users().save(admin)

  await admin.setRole('admin')

  next = sinon.fake()

  handle = {
    response: {
      redirect: sinon.fake()
    },
    auth: {
      user: null
    }
  }

  middleware = new GetOrganizationTicketsAccess()
})

beforeEach(async () => {
  handle.response.redirect = sinon.fake()
})

test('check if middleware prevents users from see organization tickets', async ({
  assert
}) => {
  handle.auth.user = user
  await middleware.handle(handle, next)
  assert.isTrue(handle.response.redirect.called)
})

test('check if the middleware allows admins to see organization tickets', async ({
  assert
}) => {
  handle.auth.user = admin
  await middleware.handle(handle, next)
  assert.isFalse(handle.response.redirect.called)
})
