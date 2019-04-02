'use strict'

const { test, trait, before } = use('Test/Suite')('Submit Expense Integration Test')

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
let user = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'submit-expense-e2e'
  })

  user = await UserFactory.make({ email: 'new-expense-e2e@email.com', password: 'userpassword' })
  await organization.users().save(user)
})

test('Users can submit new expenses', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/newexpense`)

  await page
    .assertHas('SUBMIT EXPENSE')
    .waitForElement('#form__title')
    .waitForElement('#memo')
    .waitForElement('#price')
    .waitForElement('#tax')
    .type('#form__title', 'Test Title')
    .type('#memo', 'Test Memo')
    .type('#price', '10')
    .type('#tax', '1')
    .click('#submit-expense-btn')
    .waitFor(500)
    .assertHas('Your expense was filed.')
}).timeout(60000)

test('Users can add and remove receipts', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/newexpense`)

  await page
    .assertHas('SUBMIT EXPENSE')
    .waitForElement('#add_receipt_button')
    .assertNotExists('#receipt_details_1')
    .click('#add_receipt_button')
    .waitForElement('#receipt_details_1')
    .assertExists('#receipt_details_1')
    .click('#remove_receipt_button')
    .waitFor(500)
    .assertNotExists('#receipt_details_1')
}).timeout(60000)

test('All the fields must be filled to submit', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/newexpense`)

  await page
    .assertHas('SUBMIT EXPENSE')
    .waitForElement('#submit-expense-btn')
    .click('#submit-expense-btn')
    .waitFor(1000)
    .assertPath(`/organization/${organization.slug}/newexpense`)
}).timeout(60000)
