'use strict'

const { test, trait, before } = use('Test/Suite')(
  'Organization login integration test'
)

const { OrganizationFactory, UserFactory, TicketFactory } = models

trait('Test/Browser', {
  defaultViewport: {
    width: 1280,
    height: 720,
    isMobile: false
  },
  headless: true,
  slowMo: 100
})

let organization = null
let user = null
let admin = null
let adminTicket = null
let userTicket = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'e2e-test'
  })

  admin = await UserFactory.make({
    email: 'e2e-admin@email.com',
    password: 'adminpassword'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')

  user = await UserFactory.make({
    email: 'e2e-user@email.com',
    password: 'userpassword'
  })
  await organization.users().save(user)

  adminTicket = await TicketFactory.make()
  await adminTicket.user().associate(admin)

  userTicket = await TicketFactory.make()
  await userTicket.user().associate(user)
})

test('Entering an organization and clicking "Find workspace" should lead to login page', async ({
  browser
}) => {
  const page = await browser.visit('/organization')
  await page
    .waitForElement('#organization-input')
    .type('#organization-input', 'e2e-test')
    .click('#organization-workspace-submit')
    .waitFor(500)
    .assertPath('/organization/' + organization.slug + '/login')
    .assertHas('EMAIL')
    .assertHas('PASSWORD')
}).timeout(0)

test('Leaving organization field empty should not lead to login page', async ({
  browser
}) => {
  const page = await browser.visit('/organization')
  await page
    .waitForElement('#organization-input')
    .type('#organization-input', '')
    .click('#organization-workspace-submit')
    .waitFor(500)
    .assertPath('/organization')
}).timeout(0)

test('Login in with a user account should lead to the dashboard page', async ({
  browser
}) => {
  const page = await browser.visit('/organization')
  await page
    .waitForElement('#organization-input')
    .type('#organization-input', 'e2e-test')
    .click('#organization-workspace-submit')
    .waitForElement('#form__email')
    .waitForElement('#form__password')
    .type('#form__email', user.email)
    .type('#form__password', 'userpassword')
    .click('#sign-in-btn')
    .waitFor(500)
    .assertPath('/organization/' + organization.slug)
    .assertHas('View or Make Claims Here')
}).timeout(0)

test('Login in with an admin account should lead to the dashboard page', async ({
  browser
}) => {
  const page = await browser.visit('/organization')
  await page
    .waitForElement('#organization-input')
    .type('#organization-input', 'e2e-test')
    .click('#organization-workspace-submit')
    .waitForElement('#form__email')
    .waitForElement('#form__password')
    .type('#form__email', admin.email)
    .type('#form__password', 'adminpassword')
    .click('#sign-in-btn')
    .waitFor(500)
    .assertPath('/organization/' + organization.slug + '/admin')
    .assertHas('Manage submitted tickets right here')
}).timeout(0)
