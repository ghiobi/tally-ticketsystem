'use strict'

const { test, trait, before } = use('Test/Suite')('Export Ticket Integration Test')

const { OrganizationFactory, UserFactory, TicketFactory } = models
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
let user = null
let ticket1 = null
let ticket2 = null
let admin = null
let userNoTickets = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'export-e2e-test'
  })

  user = await UserFactory.make({
    email: 'ticket-export-controller-test@email.com',
    password: 'password'
  })

  userNoTickets = await UserFactory.make({
    email: 'ticket-export-controller-test-no-tickets@email.com',
    password: 'password'
  })

  admin = await UserFactory.create({
    email: 'ticket-export-controller-test-admin@email.com',
    password: 'password'
  })

  await admin.setRole('admin')

  await organization.users().save(user)
  await organization.users().save(admin)
  await organization.users().save(userNoTickets)

  ticket1 = await TicketFactory.make()
  await ticket1.user().associate(user)

  ticket2 = await TicketFactory.make()
  await ticket2.user().associate(admin)
})

test('Assert non-admin users are only shown their own tickets', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'password')
  const page = await browser.visit(`/organization/${organization.slug}/ticket/export`)

  await page
    .assertHas('EXPORT TICKETS')
    .assertValue('[name="ticket"]', ticket1.id.toString())
    .assertIsNotChecked('#exportSelectAll')
    .assertCount('[name="ticket"]', 1)
}).timeout(60000)

test('Assert admin users are displayed all tickets from their organization', async ({ browser }) => {
  await await actions.login(browser, organization.slug, admin.email, 'password')
  const page = await browser.visit(`/organization/${organization.slug}/ticket/export`)

  await page
    .assertHas('EXPORT TICKETS')
    .assertIsNotChecked('#exportSelectAll')
    .assertCount('[name="ticket"]', 2)
}).timeout(60000)

test('Assert download modal is not visible then visible', async ({ browser }) => {
  await await actions.login(browser, organization.slug, admin.email, 'password')
  const page = await browser.visit(`/organization/${organization.slug}/ticket/export`)

  await page
    .assertHas('EXPORT TICKETS')
    .assertIsNotVisible('#downloadModal')
    .click('#toggleDownloadModal')
    .waitFor(500)
    .assertIsVisible('#downloadModal')
}).timeout(60000)

test('Assert user with no tickets is not shown a table', async ({ browser }) => {
  await await actions.login(browser, organization.slug, userNoTickets.email, 'password')
  const page = await browser.visit(`/organization/${organization.slug}/ticket/export`)

  await page
    .assertHas('EXPORT TICKETS')
    .assertNotExists('#exportForm')
    .assertHas('There are no tickets here')
}).timeout(60000)
