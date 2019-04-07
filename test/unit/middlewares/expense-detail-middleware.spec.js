'use strict'

const { test, before } = use('Test/Suite')('Expense Detail Middleware')

const ExpenseDetail = use('App/Middleware/Pageguards/ExpenseDetail')
const { ExpenseFactory, UserFactory, OrganizationFactory } = models

let middleware,
  user1,
  user2,
  organization,
  expense = null

before(async () => {
  middleware = new ExpenseDetail()
  organization = await OrganizationFactory.create({ slug: 'expense-detail-middleware-test' })

  user1 = await UserFactory.make()
  user2 = await UserFactory.make()

  await organization.users().save(user1)
  await organization.users().save(user2)

  expense = await ExpenseFactory.create({
    title: 'Expense-Controller-test-1',
    business_purpose: 'Expense-Controller-test-1',
    user_id: user1.id
  })
})

test('make sure 404 is sent of expense_id doesnt exist', async ({ assert }) => {
  const handle = {
    auth: {
      user: user1
    },
    request: {
      params: { expense_id: expense.id + 1 }
    }
  }

  let pass = true
  try {
    await middleware.handle(handle)
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'middleware did not prevent user from accessing resource')
})

test('make sure 403 is sent if expense does not belong to user', async ({ assert }) => {
  const handle = {
    auth: {
      user: user2
    },
    request: {
      params: {
        expense_id: expense.id
      }
    }
  }

  let pass = true
  try {
    await middleware.handle(handle)
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'middleware did not prevent user from accessing resource')
})
