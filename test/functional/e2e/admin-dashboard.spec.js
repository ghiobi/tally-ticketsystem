'use strict'

const { test, trait, before } = use('Test/Suite')('Admin Ticket Dashboard Integration Test')

const { OrganizationFactory, UserFactory } = models

const actions = require('./actions.js')

trait('Test/Browser', {
  defaultViewport: {
    width: 1280,
    height: 720,
    isMobile: false
  },
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})

let organization = null
let admin = null
let user = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'admin-dashboard-e2e'
  })

  admin = await UserFactory.make({ email: 'admin-e2e@email.com', password: 'password' })
  await organization.users().save(admin)
  await admin.setRole('admin')

  user = await UserFactory.make({ email: 'user-e2e@email.com', password: 'password' })
  await organization.users().save(user)
})

test('Admins can access their dashboard', async ({ browser }) => {
  await actions.login(browser, organization.slug, admin.email, 'password')

  const page = await browser.visit(`/organization/${organization.slug}/admin/tickets`)

  await page.assertHas('TICKETS').assertHas('Manage submitted tickets right here.')
}).timeout(60000)

test('Users cannot access the page', async ({ browser }) => {
  await actions.login(browser, organization.slug, user.email, 'password')

  const page = await browser.visit(`/organization/${organization.slug}/admin/tickets`)

  await page.assertHas('403').assertHas('Ooops')
}).timeout(60000)

test('Admins can use the tickets filters', async ({ browser }) => {
  await actions.login(browser, organization.slug, admin.email, 'password')

  const page = await browser.visit(`/organization/${organization.slug}/admin/tickets?show=all`)

  await page
    .waitForElement('#mine-btn')
    .click('#mine-btn')
    .waitFor(1000)
    .assertQueryParam('show', 'mine')
    .waitForElement('#closed-btn')
    .click('#closed-btn')
    .waitFor(1000)
    .assertQueryParam('show', 'closed')
    .waitForElement('#all-btn')
    .click('#all-btn')
    .waitFor(1000)
    .assertQueryParam('show', 'all')
}).timeout(60000)

test('Admins can see ratings when on closed tickets page', async ({ browser }) => {
  await actions.login(browser, organization.slug, admin.email, 'password')

  const page = await browser.visit(`/organization/${organization.slug}/admin/tickets?show=all`)

  await page
    .waitForElement('#closed-btn')
    .click('#closed-btn')
    .waitFor(1000)
    .assertQueryParam('show', 'closed')
    .assertHas('Rating')
}).timeout(60000)
