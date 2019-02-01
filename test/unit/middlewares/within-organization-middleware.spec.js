'use strict'
const sinon = require('sinon')

const { test, before, beforeEach } = use('Test/Suite')(
  'Authorize User To Be Within Organization'
)
const { OrganizationFactory } = models

const WithinOrganization = use('App/Middleware/WithinOrganization')

let next = null
let handle = null
let middleware = null
let organization = null

before(async () => {
  organization = await OrganizationFactory.create()
})

beforeEach(async () => {
  next = sinon.fake()

  handle = {
    auth: {
      user: null
    },
    request: {
      organization
    }
  }

  middleware = new WithinOrganization()
})

test('makes sure the authenticated user is part of the same organization', async ({
  assert
}) => {
  handle.auth = {
    user: { organization_id: organization.id }
  }

  await middleware.handle(handle, next)
  assert.isTrue(next.called, 'next() was not called')
})

test('makes sure the authenticated user does not access another organization', async ({
  assert
}) => {
  handle.auth = {
    user: { organization_id: -1 }
  }

  let pass = true
  try {
    await middleware.handle(handle, next)
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'middleware did not prevent user from accessing resource')
  assert.isFalse(next.called, 'next() was not called')
})
