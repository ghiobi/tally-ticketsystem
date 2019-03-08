'use strict'

const { test, trait, before } = use('Test/Suite')('Forgot-password Controller')
const { OrganizationFactory, UserFactory, TokenFactory } = models

trait('Test/ApiClient')

let organization = null
let user = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'forgot-password-controller-test'
  })

  user = await UserFactory.make({
    email: 'forgot-password-controller-test@email.com',
    password: 'password'
  })
  await organization.users().save(user)

  const token = await TokenFactory.make({
    token: 'forgot-controller-token-testing'
  })
  await user.tokens().save(token)
})

test('Check that a user can reach forgot-password page', async ({ client }) => {
  const response = await client.get(`organization/${organization.slug}/forgot-password`).end()

  response.assertStatus(200)
})

test('make sure the user can request token to reset password', async ({ client }) => {
  const response = await client
    .post(`/organization/${organization.slug}/forgot-password`)
    .send({
      email: 'Forgot-password-controller-test@email.com'
    })
    .end()
  response.assertRedirect('/')
})

test('Check that a user can reach reset-password page', async ({ client }) => {
  const token = 'forgot-controller-token-testing'
  const response = await client.get(`/resetpassword?token=${token}`).end()

  response.assertStatus(200)
})

test('Check that a user can submit new password', async ({ client }) => {
  const token = 'forgot-controller-token-testing'
  const response = await client
    .post('/resetpassword')
    .send({
      password: 'newpass',
      password_confirmation: 'newpass',
      token: token
    })
    .end()

  response.assertRedirect('/')
})
