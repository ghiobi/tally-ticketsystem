'use strict'

const { test, trait, before } = use('Test/Suite')('Webpages integration test')

const { OrganizationFactory, UserFactory, TicketFactory } = models

trait('Test/Browser', {
  defaultViewport: {
    width: 1280,
    height: 720,
    isMobile: false
  },
  headless: true
})

let organization = null
let user = null
let admin = null
let adminTicket = null
let userTicket = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'e2e-test-webpages'
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

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')
  await page.assertHas('Tally, A Bot')
}).timeout(60000)

test('Clicking "Sign in" on homepage redirects to organization sign in page', async ({
  browser
}) => {
  const page = await browser.visit('/')
  await page
    .waitForElement('#organization-signin')
    .click('#organization-signin')
    .waitForElement('#organization-input')
    .assertPath('/organization')
    .assertHas('SIGN INTO YOUR ORGANIZATION')
}).timeout(60000)
