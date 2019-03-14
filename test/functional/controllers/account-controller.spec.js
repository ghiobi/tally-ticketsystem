'use strict'

const { test, trait, before, beforeEach } = use('Test/Suite')('Account Controller')
const { OrganizationFactory, UserFactory } = models
const AccountController = use('App/Controllers/Http/Account/AccountController')
const sinon = require('sinon')

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization, admin, controller, handle

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'account-controller-test'
  })

  admin = await UserFactory.make({
    email: 'account-contorller@email.com',
    password: 'password'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')
})

beforeEach(async () => {
  controller = new AccountController()
  handle = {
    view: {
      render: sinon.fake()
    },
    auth: {
      user: admin
    },
    request: {
      organization: organization
    },
    session: {
      withErrors: sinon.fake.returns({ flashAll: sinon.fake() })
    },
    response: {
      redirect: sinon.fake()
    }
  }
})

test('Make sure Account page is displayed properly', async ({ assert }) => {
  await controller.index(handle)
  assert.equal(handle.view.render.args[0][0], 'account.index')
  assert.isTrue(handle.view.render.called)
})

test('Make sure password is validated before saving', async ({ assert }) => {
  handle.request = {
    post: sinon.fake.returns({ newPassword: 'test', confirmPassword: 'test' }),
    only: sinon.fake.returns({ newPassword: 'test', confirmPassword: 'test' }),
    ...handle.request
  }
  await controller.password(handle)
  assert.deepEqual(handle.session.withErrors.args[0][0], [
    {
      message: 'Passwords needs to be 6 in length',
      field: 'newPassword',
      validation: 'min'
    }
  ])
  assert.isTrue(handle.response.redirect.called)
})

test('Make sure password and confirm password are the same before saving', async ({ assert }) => {
  handle.request = {
    post: sinon.fake.returns({
      newPassword: 'testing2',
      confirmPassword: 'testing'
    }),
    only: sinon.fake.returns({
      newPassword: 'testing2',
      confirmPassword: 'testing'
    }),
    ...handle.request
  }
  await controller.password(handle)
  assert.deepEqual(handle.session.withErrors.args[0][0], [
    {
      message: 'Passwords are not the same',
      field: 'confirmPassword',
      validation: 'same'
    }
  ])

  assert.isTrue(handle.response.redirect.called)
})

test('Check that a user can reach my account page', async ({ client }) => {
  const response = await client
    .get(`organization/${organization.slug}/account`)
    .loginVia(admin)
    .end()

  response.assertStatus(200)
})

test('CHeck that password can change', async ({ client, assert }) => {
  const oldHash = admin.password
  // console.log(currentHash)
  await client
    .post(`organization/${organization.slug}/account/password`)
    .send({ newPassword: 'testing', confirmPassword: 'testing' })
    .loginVia(admin)
    .end()
  await admin.reload()

  const newHash = admin.password

  assert.notEqual(oldHash, newHash)
})
