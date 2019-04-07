'use strict'

const { test } = use('Test/Suite')('Reset Password Middleware')

const ResetPassword = use('App/Middleware/Pageguards/ResetPassword')

test('make sure exception is thrown when token does not exist', async ({ assert }) => {
  const middleware = new ResetPassword()

  const handle = {
    request: {},
    params: { token: 'test' }
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

test('make sure exception is thrown when token does not exist (POST)', async ({ assert }) => {
  const middleware = new ResetPassword()

  const handle = { request: { token: 'test', password: 'password', password_confirmation: 'password' }, params: {} }

  let pass = true
  try {
    await middleware.handle(handle)
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'middleware did not prevent user from accessing resource')
})
