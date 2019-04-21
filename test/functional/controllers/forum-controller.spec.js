'use strict'

const { test, trait, before } = use('Test/Suite')('Forum Controller')
const { OrganizationFactory, UserFactory, TopicFactory, TopicMessage } = models

trait('Test/ApiClient')
trait('Auth/Client')
trait('Session/Client')

let organization = null
let user = null
let topic = null
let admin = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'forum-controller-test'
  })

  user = await UserFactory.make({
    email: 'forum-controller-test@email.com',
    password: 'password'
  })

  admin = await UserFactory.create({
    email: 'forum@email.com',
    password: 'password'
  })

  await admin.setRole('admin')

  await organization.users().save(user)
  await organization.users().save(admin)

  topic = await TopicFactory.make()
  await topic.user().associate(user)
})

test('Make sure user is redirected back after submitting reply', async ({ client }) => {
  const response = await client
    .post(`organization/${organization.slug}/forum/${topic.id}/reply`)
    .send({ reply: 'test' })
    .loginVia(user)
    .end()

  response.assertRedirect('/')
})

test('Make sure TopicMessage is persisted', async ({ client, assert }) => {
  await client
    .post(`organization/${organization.slug}/forum/${topic.id}/reply`)
    .send({ reply: 'ASDFGHJKL' })
    .loginVia(user)
    .end()

  const message = await TopicMessage.query()
    .where('body', 'ASDFGHJKL')
    .where('user_id', user.id)
    .first()

  assert.isNotNull(message)
})
