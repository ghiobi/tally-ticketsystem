'use strict'

const { test, trait, before } = use('Test/Suite')('Expense integration test')

const { OrganizationFactory, UserFactory, ExpenseFactory } = models

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
    slug: 'expense-e2e'
  })

  user = await UserFactory.make({
    email: 'expense-e2e@email.com',
    password: 'userpassword'
  })
  await organization.users().save(user)

  await ExpenseFactory.create({
    title: 'Expense-e2e-test-1',
    business_purpose: 'Expense-e2e-test-1',
    user_id: user.id
  })
})

test('Clicking on delete should prompt user to confirm with modal', async ({ browser }) => {
  const loginpage = await browser.visit('/organization')
  await loginpage
    .waitForElement('#organization-input')
    .type('#organization-input', 'expense-e2e')
    .click('#organization-workspace-submit')
    .waitForElement('#form__email')
    .waitForElement('#form__password')
    .type('#form__email', user.email)
    .type('#form__password', 'userpassword')
    .click('#sign-in-btn')
    .waitFor(500)

  const expensePage = await browser.visit(`/organization/${organization.slug}/expense`)

  await expensePage
    .waitFor(500)
    .waitForElement('.fa-trash-alt')
    .click('.fa-trash-alt')
    .waitForElement('#removeModal.show')
    .assertExists('#removeModal.show')
}).timeout(60000)
