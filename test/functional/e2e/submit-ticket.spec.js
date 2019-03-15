'use strict'

const { test, trait, before } = use('Test/Suite')('Submit ticket integration test')

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
    slug: 'submit-ticket-e2e-test'
  })

  admin = await UserFactory.make({
    email: 'e2e-admin2@email.com',
    password: 'adminpassword'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')

  user = await UserFactory.make({
    email: 'e2e-user2@email.com',
    password: 'userpassword'
  })
  await organization.users().save(user)

  adminTicket = await TicketFactory.make()
  await adminTicket.user().associate(admin)

  userTicket = await TicketFactory.make()
  await userTicket.user().associate(user)
})

test('User clicks submit ticket should be redirected to the "Submit Ticket" page', async ({ browser }) => {
  const page = await browser.visit('/organization')
  await page
    .waitForElement('#organization-input')
    .type('#organization-input', 'submit-ticket-e2e-test')
    .click('#organization-workspace-submit')
    .waitForElement('#form__email')
    .waitForElement('#form__password')
    .type('#form__email', user.email)
    .type('#form__password', 'userpassword')
    .click('#sign-in-btn')
    .waitFor(500)
    .click('#submitTicket')
    .waitForElement('#form__title')
    .waitForElement('#form__body')
    .assertPath('/organization/' + organization.slug + '/ticket/create')
}).timeout(30000)

test('User on "Submit ticket" page should not be able to submit the form if fields are empty', async ({ browser }) => {
  const page = await browser.visit('/organization')
  await page
    .waitForElement('#organization-input')
    .type('#organization-input', 'submit-ticket-e2e-test')
    .click('#organization-workspace-submit')
    .waitForElement('#form__email')
    .waitForElement('#form__password')
    .type('#form__email', user.email)
    .type('#form__password', 'userpassword')
    .click('#sign-in-btn')
    .waitFor(500)
    .click('#submitTicket')
    .waitForElement('#form__title')
    .waitForElement('#form__body')
    //only filling the Title field
    .type('#form__title', 'some title')
    .click('#ticketSubmit')
    .waitFor(500)
    .assertPath('/organization/' + organization.slug + '/ticket/create')
    .clear('#form__title')
    //only filling the body
    .type('#form__body', 'ticket body blablalba')
    .click('#ticketSubmit')
    .waitFor(500)
    .assertPath('/organization/' + organization.slug + '/ticket/create')
    .clear('#form__body')
    //both fields not filled
    .click('#ticketSubmit')
    .waitFor(500)
    .assertPath('/organization/' + organization.slug + '/ticket/create')
}).timeout(30000)

test('User clicking on "Cancel" should lead back to the user ticket dashboard', async ({ browser }) => {
  const page = await browser.visit('/organization')
  await page
    .waitForElement('#organization-input')
    .type('#organization-input', 'submit-ticket-e2e-test')
    .click('#organization-workspace-submit')
    .waitForElement('#form__email')
    .waitForElement('#form__password')
    .type('#form__email', user.email)
    .type('#form__password', 'userpassword')
    .click('#sign-in-btn')
    .waitFor(500)
    .click('#submitTicket')
    .waitForElement('#form__title')
    .waitForElement('#form__body')
    .click('#ticketCancel')
    .assertPath('/organization/' + organization.slug + '/')
}).timeout(30000)

test('User correctly filling the fields and clicking "Submit" should be directed to dashboard', async ({ browser }) => {
  const page = await browser.visit('/organization')
  await page
    .waitForElement('#organization-input')
    .type('#organization-input', 'submit-ticket-e2e-test')
    .click('#organization-workspace-submit')
    .waitForElement('#form__email')
    .waitForElement('#form__password')
    .type('#form__email', user.email)
    .type('#form__password', 'userpassword')
    .click('#sign-in-btn')
    .waitFor(500)
    .click('#submitTicket')
    .waitForElement('#form__title')
    .waitForElement('#form__body')
    .type('#form__title', 'some title')
    .type('#form__body', 'ticket body blablalba')
    .click('#ticketSubmit')
    .waitFor(500)
    .assertPath('/organization/' + organization.slug)
    .assertHas('Ticket has been created')
}).timeout(30000)
