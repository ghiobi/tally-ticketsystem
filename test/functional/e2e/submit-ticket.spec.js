'use strict'

const { test, trait, before } = use('Test/Suite')('Submit ticket integration test')

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
let user = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'submit-ticket-e2e-test'
  })

  user = await UserFactory.make({
    email: 'e2e-user2@email.com',
    password: 'userpassword'
  })
  await organization.users().save(user)
})

test('User clicks submit ticket should be redirected to the "Submit Ticket" page', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')
  const page = await browser.visit('/organization')
  await page
    .click('#submitTicket')
    .waitForElement('#form__title')
    .waitForElement('#form__body')
    .assertPath('/organization/' + organization.slug + '/ticket/create')
}).timeout(30000)

test('User on "Submit ticket" page should not be able to submit the form if fields are empty', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')
  const page = await browser.visit('/organization')
  await page
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
  await await actions.login(browser, organization.slug, user.email, 'userpassword')
  const page = await browser.visit('/organization')
  await page
    .click('#submitTicket')
    .waitForElement('#form__title')
    .waitForElement('#form__body')
    .click('#ticketCancel')
    .assertPath('/organization/' + organization.slug + '/')
}).timeout(30000)

test('User correctly filling the fields and clicking "Submit" should be directed to dashboard', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')
  const page = await browser.visit('/organization')
  await page
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
