'use strict'

const { test, trait, before } = use('Test/Suite')('Expense Controller')
const { OrganizationFactory, UserFactory, ExpenseFactory, Expense } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization, admin, expense

before(async () => {
  organization = await OrganizationFactory.create({ slug: 'Expense-controller-test' })

  admin = await UserFactory.make({
    email: 'Expense-controller@email.com',
    password: 'password'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')

  expense = await ExpenseFactory.create({
    title: 'Expense-Controller-test-1',
    business_purpose: 'Expense-Controller-test-1',
    user_id: admin.id
  })
})

test('Make sure user can delete ', async ({ client, assert }) => {
  const response = await client
    .delete(`organization/${organization.slug}/expense`)
    .loginVia(admin)
    .send({ form_data: expense.id })
    .end()

  const res = await Expense.query()
    .where('id', expense.id)
    .first()

  response.assertStatus(200)
  response.assertRedirect('/')
  assert.isNull(res)
})
