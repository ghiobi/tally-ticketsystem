'use strict'

const { test, before } = use('Test/Suite')('ExpenseLineItem Model')
const { UserFactory, ExpenseFactory, ExpenseLineItemFactory, ExpenseLineItem } = models

let user = null
let expense = null
let line_item = null

before(async () => {
  user = await UserFactory.create()

  expense = await ExpenseFactory.create({
    user_id: user.id,
    title: 'foo',
    business_purpose: 'transportation'
  })

  line_item = await ExpenseLineItemFactory.create({
    expense_id: expense.id,
    memo: 'test memo',
    currency: 'CAD',
    region: 'QC-CAD',
    category: 'taxi',
    text: 'test text',
    price: 12.34,
    tax: 5.67
  })
})

test('Make sure expense line item can be inserted', async ({ assert }) => {
  const inDatabase = await ExpenseLineItem.find(line_item.id)
  assert.exists(inDatabase)
})

test('Make sure expense line item is assigned to the correct expense', async ({ assert }) => {
  const assigned_expense = await line_item.expense().fetch()

  assert.isNotNull(assigned_expense)
  assert.deepEqual(assigned_expense, expense)
})

test('Make sure expense line item memo can be updated', async ({ assert }) => {
  await line_item.updateMemo('bar')
  const inDatabase = await ExpenseLineItem.find(line_item.id)

  assert.equal(inDatabase.memo, 'bar')
})

test('Make sure expense line item currency can be updated', async ({ assert }) => {
  await line_item.updateCurrency('USD')
  const inDatabase = await ExpenseLineItem.find(line_item.id)

  assert.equal(inDatabase.currency, 'USD')
})

test('Make sure expense line item category can be updated', async ({ assert }) => {
  await line_item.updateCurrency('Food')
  const inDatabase = await ExpenseLineItem.find(line_item.id)

  assert.equal(inDatabase.currency, 'Food')
})

test('Make sure expense line item region can be updated', async ({ assert }) => {
  await line_item.updateRegion('ONT-CAD')
  const inDatabase = await ExpenseLineItem.find(line_item.id)

  assert.equal(inDatabase.region, 'ONT-CAD')
})

test('Make sure expense line item text can be updated', async ({ assert }) => {
  await line_item.updateText('bar')
  const inDatabase = await ExpenseLineItem.find(line_item.id)

  assert.equal(inDatabase.text, 'bar')
})

test('Make sure expense line item price can be updated', async ({ assert }) => {
  await line_item.updatePrice(43.21)
  const inDatabase = await ExpenseLineItem.find(line_item.id)

  assert.equal(inDatabase.price, 43.21)
})

test('Make sure expense line item tax can be updated', async ({ assert }) => {
  await line_item.updateTax(12.34)
  const inDatabase = await ExpenseLineItem.find(line_item.id)

  assert.equal(inDatabase.tax, 12.34)
})
