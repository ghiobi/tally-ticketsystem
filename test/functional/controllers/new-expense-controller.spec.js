'use strict'

const { test, trait, before } = use('Test/Suite')('New Expense Controller')
const { OrganizationFactory, UserFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization, user

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'new-expense-controller-test'
  })
  user = await UserFactory.make({
    email: 'test-user@email.com',
    password: 'password'
  })
  await organization.users().save(user)
})

test('User can submit an expense', async ({ client }) => {
  const load = {
    title: 'title',
    business_purpose: 'General',
    memo: ['memo'],
    category: ['Transportation'],
    currency: ['CAD'],
    region: ['CAD-QC'],
    price: ['1'],
    tax: ['1']
  }

  const response = await client
    .post(`organization/${organization.slug}/newexpense/submit`)
    .send(load)
    .loginVia(user)
    .end()

  response.assertStatus(200)
})
