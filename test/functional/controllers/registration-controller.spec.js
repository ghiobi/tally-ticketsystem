'use strict'

const { test, trait } = use('Test/Suite')('Registration Controller')
const { User } = models

trait('Test/ApiClient')

test('make sure registration is satisfied', async ({ client, assert }) => {
  const response = await client
    .post('/join')
    .send({
      user: {
        name: 'Registration User',
        email: 'registration@email.com',
        password: 'password',
        external_id: '123'
      },
      organization: {
        name: 'Organization',
        slug: 'org4niz4t10n',
        external_id: 'waw'
      }
    })
    .end()

  response.assertRedirect('/organization/org4niz4t10n/login')

  const user = await User.query()
    .where('email', 'registration@email.com')
    .first()

  assert.isTrue(await user.hasRole('owner'))
  assert.isTrue(await user.hasRole('admin'))
})

test('make sure registration fails for duplicate organization slug', async ({
  client
}) => {
  const response = await client
    .post('/join')
    .send({
      user: {
        name: 'Registration User',
        email: 'registration@email.com',
        password: 'password'
      },
      organization: {
        name: 'Organization',
        slug: 'org4niz4t10n'
      }
    })
    .end()

  response.assertRedirect('/')
})

test('make sure registration fails for missing fields', async ({ client }) => {
  const response = await client
    .post('/join')
    .send({
      user: {
        name: 'Registration User',
        email: '',
        password: 'password'
      },
      organization: {
        name: 'Organization',
        slug: ''
      }
    })
    .end()

  response.assertRedirect('/')
})

test('make sure registration fails short password', async ({ client }) => {
  const response = await client
    .post('/join')
    .send({
      user: {
        name: 'Registration User',
        email: 'registration@email.com',
        password: 'short'
      },
      organization: {
        name: 'Organization',
        slug: 'registratiofewafewa'
      }
    })
    .end()

  response.assertRedirect('/')
})
