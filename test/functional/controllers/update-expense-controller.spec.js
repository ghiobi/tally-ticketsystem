'use strict'

const { test, trait, before } = use('Test/Suite')('Update Expense Controller')

const Expense = use('App/Models/Expense')
const ExpenseLineItem = use('App/Models/ExpenseLineItem')

const { OrganizationFactory, UserFactory, ExpenseFactory, ExpenseLineItemFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization, user, expense, lineItem

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'update-expense-controller-test'
  })
  user = await UserFactory.make({
    email: 'test-user@email.com',
    password: 'password'
  })
  await organization.users().save(user)

  expense = await ExpenseFactory.create({
    title: 'Test Expense',
    business_purpose: 'Conference',
    user_id: user.id
  })

  lineItem = await ExpenseLineItemFactory.create({
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

test('User can update an expense details', async ({ client, assert }) => {
  const load = {
    title: 'New Title',
    business_purpose: 'General',
    id: [lineItem.id],
    memo: ['memo'],
    category: ['Transportation'],
    currency: ['USD'],
    region: ['United States'],
    price: ['1.23'],
    tax: ['1.23']
  }

  const response = await client
    .post(`/organization/${organization.slug}/expense/update/${expense.id}`)
    .send(load)
    .loginVia(user)
    .end()

  response.assertStatus(200)

  const updatedExpense = await Expense.query()
    .where('id', expense.id)
    .first()

  assert.equal(updatedExpense.title, 'New Title')
  assert.equal(updatedExpense.business_purpose, 'General')

  const updatedExpenseLineItem = await ExpenseLineItem.query()
    .where('id', lineItem.id)
    .first()

  assert.equal(updatedExpenseLineItem.expense_id, expense.id)
  assert.equal(updatedExpenseLineItem.memo, 'memo')
  assert.equal(updatedExpenseLineItem.category, 'Transportation')
  assert.equal(updatedExpenseLineItem.currency, 'USD')
  assert.equal(updatedExpenseLineItem.region, 'United States')
  assert.equal(updatedExpenseLineItem.price, 1.23)
  assert.equal(updatedExpenseLineItem.tax, 1.23)
})

test('User can remove line item from existing expense', async ({ client, assert }) => {
  const load = {
    title: 'Test Expense',
    business_purpose: 'Conference',
    id: [],
    memo: [],
    category: [],
    currency: [],
    region: [],
    price: [],
    tax: []
  }

  const response = await client
    .post(`/organization/${organization.slug}/expense/update/${expense.id}`)
    .send(load)
    .loginVia(user)
    .end()

  response.assertStatus(200)

  const updatedExpenseLineItem = await ExpenseLineItem.query()
    .where('expense_id', expense.id)
    .first()

  assert.isNull(updatedExpenseLineItem)
})

test('User can add line item to existing expense', async ({ client, assert }) => {
  const load = {
    title: 'Test Expense',
    business_purpose: 'Conference',
    id: [lineItem.id, 'new'],
    memo: ['Foo', 'Bar'],
    category: ['Accomodations', 'Transportation'],
    currency: ['CAD', 'USD'],
    region: ['CAD-QC', 'United States'],
    price: ['23.33', '1.23'],
    tax: ['5.32', '1.23']
  }

  const response = await client
    .post(`/organization/${organization.slug}/expense/update/${expense.id}`)
    .send(load)
    .loginVia(user)
    .end()

  response.assertStatus(200)

  const updatedExpenseLineItem = await ExpenseLineItem.query()
    .where('expense_id', expense.id)
    .fetch()

  assert.equal(updatedExpenseLineItem.rows[1].memo, 'Bar')
  assert.equal(updatedExpenseLineItem.rows[1].category, 'Transportation')
  assert.equal(updatedExpenseLineItem.rows[1].currency, 'USD')
  assert.equal(updatedExpenseLineItem.rows[1].region, 'United States')
  assert.equal(updatedExpenseLineItem.rows[1].price, 1.23)
  assert.equal(updatedExpenseLineItem.rows[1].tax, 1.23)
})
