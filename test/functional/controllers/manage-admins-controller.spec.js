'use strict'

const { test, trait, before, beforeEach } = use('Test/Suite')('Manage Admins Controller')
const { OrganizationFactory, UserFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization, admin, admin2, user

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'manage-admins-controller-test'
  })

  admin = await UserFactory.make({
    email: 'manage-admins-controller@email.com',
    password: 'password'
  })
  await organization.users().save(admin)
  await admin.setRole('admin')
  await admin.setRole('owner')

  admin2 = await UserFactory.make({
    email: 'manage-admins2-@email.com',
    password: 'password'
  })
  await organization.users().save(admin2)
  await admin2.setRole('admin')

  user = await UserFactory.make({
    email: 'manage-admins3-@email.com',
    password: 'password'
  })
  await organization.users().save(user)
})

beforeEach(async () => {})

test('Check that admins can grant admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/addAdmin`)
    .send({ input_user_id: user.id })
    .loginVia(admin)
    .end()
  response.assertStatus(200)
})

test('Check that owners can remove admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/removeAdmin`)
    .send({ input_user_id: admin2.id })
    .loginVia(admin)
    .end()

  response.assertStatus(200)
})

test('Check that admins cannot remove admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/removeAdmin`)
    .send({ input_user_id: admin.id })
    .loginVia(admin2)
    .end()

  response.assertStatus(403)
})
