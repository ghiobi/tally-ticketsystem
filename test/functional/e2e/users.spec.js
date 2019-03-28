'use strict'

const { test, trait, before } = use('Test/Suite')('Users page integration test')

const { OrganizationFactory, UserFactory } = models

const actions = require('./actions.js')

trait('Test/Browser', {
  defaultViewport: {
    width: 1280,
    height: 720,
    isMobile: false
  },
  headless: true
})

let organization = null
let owner = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'users-page-e2e'
  })

  owner = await UserFactory.make({
    email: 'users-page-e2e@email.com',
    password: 'userpassword'
  })
  await organization.users().save(owner)
  await owner.setRole('admin')
  await owner.setRole('owner')

  const admin = await UserFactory.make({
    email: 'users-page-e2e-2@email.com',
    password: 'userpassword'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')

  const user3 = await UserFactory.make({
    email: 'users-page-e2e-3@email.com',
    password: 'userpassword'
  })
  await organization.users().save(user3)
})

test('Admin can grant admin permission to users', async ({ browser }) => {
  await actions.login(browser, owner.email, 'userpassword')

  const userspage = await browser.visit(`/organization/${organization.slug}/admin/users`)

  await userspage
    .waitFor(500)
    .assertHas('ORGANIZATION USERS')
    .waitForElement('.addAdmin')
    .click('.addAdmin')
    .waitFor(500)
    .click('.show .btn-primary')
}).timeout(60000)

test('Owners can remove admin permission from users', async ({ browser }) => {
  await actions.login(browser, owner.email, 'userpassword')

  const userspage = await browser.visit(`/organization/${organization.slug}/admin/users`)

  await userspage
    .waitFor(500)
    .assertHas('ORGANIZATION USERS')
    .waitForElement('.removeAdmin')
    .click('.removeAdmin')
    .waitFor(500)
    .click('.show .btn-primary')
}).timeout(60000)
