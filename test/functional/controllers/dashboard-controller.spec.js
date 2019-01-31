'use strict'

const { test, trait, before, beforeEach } = use('Test/Suite')(
  'Dashboard Controller'
)
const { OrganizationFactory, UserFactory, TicketFactory } = models
const DashboardController = use(
  'App/Controllers/Http/Dashboard/DashboardController'
)
const sinon = require('sinon')

trait('Test/ApiClient')

let organization = null
let admin = null
let ticket = null
let controller = null

let handle = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'dashboard-controller-test'
  })

  admin = await UserFactory.make({
    email: 'dashboard-controller-test@email.com',
    password: 'password'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')

  ticket = await TicketFactory.make()
  await ticket.user().associate(admin)
})

beforeEach(async () => {
  controller = new DashboardController()
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

test('Make sure admin dashboard is display for admin', async ({ assert }) => {
  await controller.index(handle)
  assert.equal(handle.view.render.args[0][0], 'dashboard.admin')
  assert.isTrue(handle.view.render.called)
})
