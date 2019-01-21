'use strict'

const { test, trait, before } = use('Test/Suite')('Login Controller')
const { OrganizationFactory, UserFactory } = models

trait('Test/ApiClient')

let organization = null
let user = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'login-controller-test'
  })

  user = await UserFactory.make({
    email: 'login-controller-test@email.com',
    password: 'password'
  })

  await organization.users().save(user)
})

test('make sure the user is redirected to an authenticated dashboard page', async ({
  client
}) => {
  const response = await client
    .post(`/organization/${organization.slug}/login`)
    .send({
      email: 'login-controller-test@email.com',
      password: 'password'
    })
    .end()

  response.assertRedirect(`/organization/${organization.slug}`)
})

test('make sure the user is redirected back in case of wrong email', async ({
  client
}) => {
  const response = await client
    .post(`/organization/${organization.slug}/login`)
    .send({
      email: 'wrong-email@email.com',
      password: 'password'
    })
    .end()

  // Since we're starting from '/'
  response.assertRedirect('/')
})

test('make sure the user is redirected back in case of wrong password', async ({
  client
}) => {
  const response = await client
    .post(`/organization/${organization.slug}/login`)
    .send({
      email: 'login-controller-test@email.com',
      password: 'whatisapassword'
    })
    .end()

  response.assertRedirect('/')
})
