'use strict'

const { test, trait, before } = use('Test/Suite')('Users Controller')
const { OrganizationFactory, UserFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization, admin, user

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'users-controller-test'
  })

  admin = await UserFactory.make({
    email: 'users-controller1@email.com',
    password: 'password'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')

  user = await UserFactory.make({
    email: 'users-controller2@email.com',
    password: 'password'
  })
  await organization.users().save(user)
})

test('Check that an admin can reach the users page', async ({ client }) => {
  const response = await client
    .get(`organization/${organization.slug}/admin/users`)
    .loginVia(admin)
    .end()
  response.assertStatus(200)
})

test('Check that a user cannot reach the users page', async ({ client }) => {
  const response = await client
    .get(`organization/${organization.slug}/admin/users`)
    .loginVia(user)
    .end()
  response.assertStatus(403)
})
