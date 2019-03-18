'use strict'

const { test, trait, before, beforeEach } = use('Test/Suite')('Users Controller')
const { OrganizationFactory, UserFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization, admin

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'users-controller-test'
  })

  admin = await UserFactory.make({
    email: 'users-controller@email.com',
    password: 'password'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')
})

beforeEach(async () => {})

test('Check that an admin can reach the users page', async ({ client }) => {
  // console.log(currentHash)
  const response = await client
    .get(`organization/${organization.slug}/admin/users`)
    .loginVia(admin)
    .end()
  response.assertStatus(200)
})
