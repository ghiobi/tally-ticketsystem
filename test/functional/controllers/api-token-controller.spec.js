'use strict'

const { test, trait, before, beforeEach } = use('Test/Suite')(
  'Api Token Controller'
)

const { OrganizationFactory, UserFactory, TicketFactory } = models
const ApiTokenController = use('App/Controllers/Http/Admin/ApiTokenController')

const sinon = require('sinon')

trait('Test/ApiClient')

let organization = null
let admin = null
let ticket = null
let controller = null
let handle = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'api-controller-test'
  })

  admin = await UserFactory.make({
    email: 'api-controller-test@email.com',
    password: 'password'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')

  ticket = await TicketFactory.make()
  await ticket.user().associate(admin)
})

beforeEach(async () => {
  controller = new ApiTokenController()
  handle = {
    view: {
      render: sinon.fake()
    },
    auth: {
      user: admin
    },
    request: {
      organization: organization
    }
  }
})

test('Make sure token api page is displayed for admin', async ({ assert }) => {
  await controller.index(handle)
  assert.equal(handle.view.render.args[0][0], 'admin.token')
  assert.isTrue(handle.view.render.called)
})
