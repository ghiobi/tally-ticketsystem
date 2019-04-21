const { test, trait, before } = use('Test/Suite')('Ticket page integration test')

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
let submittedTicket = null
let closedTicket = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'ticket-page-e2e-test'
  })

  user = await UserFactory.make({
    email: 'e2e-user2@email.com',
    password: 'userpassword'
  })
  await organization.users().save(user)

  submittedTicket = await TicketFactory.make({ title: 'TEST-TITLE', status: 'submitted' })
  await submittedTicket.user().associate(user)
  closedTicket = await TicketFactory.make({ status: 'closed' })
  await closedTicket.user().associate(user)
})

test('User can close and reopen ticket', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/ticket/${submittedTicket.id}`)

  await page
    .assertHas('TEST-TITLE')
    .waitForElement('#status-btn')
    .assertHas('CLOSE')
    .click('#status-btn')
    .waitFor(500)
    .waitForElement('#status-btn')
    .assertHas('REOPEN')
    .click('#status-btn')
    .waitFor(500)
    .assertHas('CLOSE')
}).timeout(60000)

test('User can rate a closed ticket', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/ticket/${closedTicket.id}`)

  await page.waitForElement('.rating').assertHas('Rate your experience')
}).timeout(60000)
