'use strict'
const sinon = require('sinon')

const { test } = use('Test/Suite')('Api Token Middleware')
const { OrganizationFactory } = models

const ApiAuth = use('App/Middleware/ApiAuth')

test('make sure exception is thrown when token is not there', async ({
  assert
}) => {
  const middleware = new ApiAuth()

  const handle = {
    request: {}
  }

  let pass = true
  try {
    await middleware.handle(handle)
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'middleware did not prevent user from accessing resource')
})

test('make sure exception is thrown when token is not valid', async ({
  assert
}) => {
  const middleware = new ApiAuth()
  const organization = await OrganizationFactory.create({
    api_token: 'api!@#$%^&*(token'
  })

  const handle = {
    request: {
      organization,
      input: sinon.fake.returns('bad!api!@#$%^&*(token')
    }
  }

  let pass = true
  try {
    await middleware.handle(handle)
    pass = false
  } catch (e) {
    // continue regardless of error
  }
  assert.equal(handle.request.input.args[0][0], 'token')
  assert.isOk(pass, 'middleware did not prevent user from accessing resource')
})

test('make sure correct token is passed', async ({ assert }) => {
  const middleware = new ApiAuth()
  const organization = await OrganizationFactory.create({
    api_token: 'api!@#$%^&*(token'
  })

  const handle = {
    request: {
      organization,
      input: sinon.fake.returns('api!@#$%^&*(token'),
      params: {
        organization: organization.slug
      }
    }
  }

  const next = sinon.fake()
  await middleware.handle(handle, next)

  assert.isTrue(next.called)
})
