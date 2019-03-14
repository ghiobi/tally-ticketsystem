'use strict'

const { test, before } = use('Test/Suite')('Expense Model')
const { UserFactory, ExpenseFactory, Expense } = models

let user = null

before(async () => {
  user = await UserFactory.create()
})

test('Make sure expense can be inserted', async ({ assert }) => {
  const expense = await ExpenseFactory.create({
    user_id: user.id,
    title: 'foo',
    business_purpose: 'transportation'
  })

  const inDatabase = await Expense.find(expense.id)
  assert.exists(inDatabase)
})

test('Make sure expense is assigned to the correct user', async ({ assert }) => {
  const expense = await ExpenseFactory.create({
    user_id: user.id,
    title: 'foo',
    business_purpose: 'transportation'
  })

  const assigned_user = await expense.user().fetch()
  assert.isNotNull(assigned_user)
  assert.deepEqual(assigned_user, user)
})

test('Make sure expense title can be updated', async ({ assert }) => {
  const expense = await ExpenseFactory.create({
    user_id: user.id,
    title: 'foo',
    business_purpose: 'transportation'
  })

  await expense.updateTitle('bar')
  const inDatabase = await Expense.find(expense.id)

  assert.equal(inDatabase.title, 'bar')
})

test('Make sure expense business purpose can be updated', async ({ assert }) => {
  const expense = await ExpenseFactory.create({
    user_id: user.id,
    title: 'foo',
    business_purpose: 'transportation'
  })

  await expense.updateBusinessPurpose('bar')
  const inDatabase = await Expense.find(expense.id)

  assert.equal(inDatabase.business_purpose, 'bar')
})
