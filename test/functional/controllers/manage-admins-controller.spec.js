'use strict'

const { test, trait, before, beforeEach } = use('Test/Suite')('Manage Admins Controller')
const { OrganizationFactory, UserFactory } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization, owner, admin2, user, user2

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'manage-admins-controller-test'
  })

  owner = await UserFactory.make({
    email: 'manage-admins-controller@email.com',
    password: 'password'
  })
  await organization.users().save(owner)
  await owner.setRole('admin')
  await owner.setRole('owner')

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

  user2 = await UserFactory.make({
    email: 'manage-admins4-@email.com',
    password: 'password'
  })
  await organization.users().save(user2)
})

beforeEach(async () => {})

test('Check that Owner can grant admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/addAdmin`)
    .send({ modal_data: user.id })
    .loginVia(owner)
    .end()
  response.assertStatus(200)
})

test('Check that admins can grant admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/addAdmin`)
    .send({ modal_data: user.id })
    .loginVia(admin2)
    .end()
  response.assertStatus(200)
})

test('Check that users cannot grant admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/addAdmin`)
    .send({ modal_data: user.id })
    .loginVia(user2)
    .end()
  response.assertStatus(403)
})

test('Check that owners can remove admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/removeAdmin`)
    .send({ modal_data: admin2.id })
    .loginVia(owner)
    .end()

  response.assertStatus(200)
})

test('Check that admins cannot remove admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/removeAdmin`)
    .send({ modal_data: owner.id })
    .loginVia(admin2)
    .end()

  response.assertStatus(403)
})

test('Check that users cannot remove admin permissions', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/admin/users/removeAdmin`)
    .send({ input_user_id: owner.id })
    .loginVia(user)
    .end()

  response.assertStatus(403)
})
