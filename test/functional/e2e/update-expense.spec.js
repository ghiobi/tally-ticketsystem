'use strict'

const { test, trait, before } = use('Test/Suite')('Update Expense Integration Test')

const Expense = use('App/Models/Expense')
const ExpenseLineItem = use('App/Models/ExpenseLineItem')

const { OrganizationFactory, UserFactory, ExpenseFactory, ExpenseLineItemFactory } = models

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
let expense = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'update-expense-e2e'
  })

  user = await UserFactory.make({ email: 'update-expense-e2e@email.com', password: 'userpassword' })
  await organization.users().save(user)

  expense = await ExpenseFactory.create({
    title: 'Test Expense',
    business_purpose: 'Conference',
    user_id: user.id
  })

  await ExpenseLineItemFactory.create({
    expense_id: expense.id,
    memo: 'Foo',
    currency: 'CAD',
    category: 'Accomodations',
    region: 'CAD-QC',
    text: 'Good Day',
    price: 23.33,
    tax: 5.32
  })
})

test('Users can access update expense page', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/expense/update/${expense.id}`)

  await page.assertHas('UPDATE EXPENSE')
}).timeout(60000)

test('Users can add and remove receipts from an existing expense', async ({ browser }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/expense/update/${expense.id}`)

  await page
    .assertHas('UPDATE EXPENSE')
    .waitForElement('#add_receipt_button')
    .assertNotExists('#receipt_details_1')
    .click('#add_receipt_button')
    .waitForElement('#receipt_details_1')
    .assertExists('#receipt_details_1')
    .click('#remove_receipt_button_1')
    .waitFor(500)
    .assertNotExists('#receipt_details_1')
}).timeout(60000)

test('Users can update an existing expense and line itme', async ({ browser, assert }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/expense/update/${expense.id}`)

  await page
    .waitForElement('#form__title')
    .waitForElement('#memo')
    .waitForElement('#price')
    .waitForElement('#tax')
    .type('#form__title', 'New ')
    .type('#memo', 'New ')
    .type('#price', '10')
    .type('#tax', '1')
    .click('#submit-expense-btn')
    .waitFor(500)
    .assertHas('Your expense was updated.')

  const updated_expense = await Expense.query()
    .where('user_id', user.id)
    .first()

  assert.equal(updated_expense.title, 'New Test Expense')

  const expenseLineItem = await ExpenseLineItem.query()
    .where('expense_id', updated_expense.id)
    .first()

  assert.equal(expenseLineItem.memo, 'New Foo')
}).timeout(60000)

test('Users can delete a line item from an existing expense', async ({ browser, assert }) => {
  await ExpenseLineItemFactory.create({
    expense_id: expense.id,
    memo: 'Bar',
    currency: 'CAD',
    category: 'Accomodations',
    region: 'CAD-QC',
    text: 'Good Day',
    price: 12.33,
    tax: 9.32
  })

  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/expense/update/${expense.id}`)

  await page
    .waitForElement('#form__title')
    .click('#remove_receipt_button_1')
    .click('#submit-expense-btn')
    .waitFor(500)
    .assertHas('Your expense was updated.')

  const expenseLineItem = await ExpenseLineItem.query()
    .where('expense_id', expense.id)
    .fetch()

  assert.equal(expenseLineItem.rows.length, 1)
}).timeout(60000)

test('Users can add a line item to an existing expense but cant submit unless fields are filled', async ({
  browser
}) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/expense/update/${expense.id}`)

  await page
    .waitForElement('#form__title')
    .click('#add_receipt_button')
    .click('#submit-expense-btn')
    .waitFor(1000)
    .assertPath(`/organization/${organization.slug}/expense/update/${expense.id}`)
}).timeout(60000)

test('Users can add a line item to an existing expense', async ({ browser, assert }) => {
  await await actions.login(browser, organization.slug, user.email, 'userpassword')

  const page = await browser.visit(`/organization/${organization.slug}/expense/update/${expense.id}`)

  await page
    .waitForElement('#form__title')
    .click('#add_receipt_button')
    .waitForElement('input[name="memo[1]"]')
    .waitForElement('input[name="price[1]"]')
    .waitForElement('input[name="tax[1]"]')
    .type('input[name="memo[1]"]', 'New Memo')
    .type('input[name="price[1]"]', '10.12')
    .type('input[name="tax[1]"]', '1.34')
    .click('#submit-expense-btn')
    .waitFor(500)
    .assertHas('Your expense was updated.')

  const expenseLineItem = await ExpenseLineItem.query()
    .where('expense_id', expense.id)
    .fetch()

  assert.equal(expenseLineItem.rows[1].memo, 'New Memo')
  assert.equal(expenseLineItem.rows[1].price, 10.12)
  assert.equal(expenseLineItem.rows[1].tax, 1.34)
}).timeout(60000)
