'use strict'
const sinon = require('sinon')

const { test, before, beforeEach } = use('Test/Suite')(
  'Set Organization To Request'
)
const { OrganizationFactory } = models

const OrganizationMiddleware = use('App/Middleware/Organization')

let flashAll = null
let next = null
let handle = null
let middleware = null
let organization = null

before(async () => {
  organization = await OrganizationFactory.create()
})

beforeEach(async () => {
  flashAll = sinon.fake()
  next = sinon.fake()

  handle = {
    auth: {
      user: null
    },
    request: {},
    response: {
      redirect: sinon.fake()
    },
    session: {
      withErrors: sinon.fake.returns({
        flashAll
      })
    },
    params: {
      organization: null
    },
    view: {
      share: sinon.fake()
    }
  }

  middleware = new OrganizationMiddleware()
})

test('makes sure the middleware finds the specific organization and sets it to the request object', async ({
  assert
}) => {
  handle.params.organization = organization.slug
  await middleware.handle(handle, next)

  assert.isTrue(next.called, 'next() was not called')
  assert.isDefined(handle.request.organization)
  assert.isFalse(flashAll.called, 'flash should not have happened')

  assert.deepEqual(handle.view.share.args[0][0], {
    organization,
    organizationRoute: `/organization/${organization.slug}`
  })
})

test('makes sure the middleware redirects when no organization is found', async ({
  assert
}) => {
  handle.params.organization = 'some-other-organization-slug'
  await middleware.handle(handle, next)

  assert.isFalse(next.called, 'next() was called')
  assert.isUndefined(handle.request.organization)

  assert.isTrue(handle.response.redirect.called)
  assert.isTrue(flashAll.called)
})

test('makes sure the authenticated user is part of the same organization', async ({
  assert
}) => {
  handle.params.organization = organization.slug
  handle.auth = {
    user: { organization_id: organization.id }
  }

  await middleware.handle(handle, next)
  assert.isTrue(next.called, 'next() was not called')
})
