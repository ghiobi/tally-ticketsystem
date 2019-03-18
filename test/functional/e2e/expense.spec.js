'use strict'

const { test, trait, before } = use('Test/Suite')('Expense integration test')

const { OrganizationFactory, UserFactory, ExpenseFactory } = models
const actions = require('./actions')

trait('Test/Browser', {
  defaultViewport: {
    width: 1280,
    height: 720,
    isMobile: false
  },
  headless: true
})

let organization = null
let user,
  user2 = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'expense-e2e'
  })

  user = await UserFactory.make({
    email: 'expense-e2e@email.com',
    password: 'userpassword'
  })
  await organization.users().save(user)

  user2 = await UserFactory.make({ email: 'expense-e2e2@email.com', password: 'userpassword' })
  await organization.users().save(user2)

  await ExpenseFactory.create({
    title: 'Expense-e2e-test-1',
    business_purpose: 'Expense-e2e-test-1',
    user_id: user.id
  })
})

test('Users with no expense should not see a table', async ({ browser }) => {
  await actions.login(browser, organization.slug, user2.email, 'userpassword')

  const expensePage = await browser.visit(`/organization/${organization.slug}/expense`)

  expensePage.assertExists('You do not have any Expenses')
}).timeout(60000)

test('Users with expenses should see a table', async ({ browser }) => {
  await actions.login(browser, organization.slug, user.email, 'userpassword')

  const expensePage = await browser.visit(`/organization/${organization.slug}/expense`)

  expensePage.assertExists('#expense-table')
}).timeout(60000)

test('Clicking on delete should prompt user to confirm with modal', async ({ browser }) => {
  await actions.login(browser, organization.slug, user.email, 'userpassword')

  const expensePage = await browser.visit(`/organization/${organization.slug}/expense`)

  await expensePage
    .waitFor(500)
    .waitForElement('.fa-trash-alt')
    .click('.fa-trash-alt')
    .waitForElement('#removeModal.show')
    .assertExists('#removeModal.show')
}).timeout(60000)
