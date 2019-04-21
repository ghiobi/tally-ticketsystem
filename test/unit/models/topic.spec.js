'use strict'

const { test, before } = use('Test/Suite')('Topic Model')

const { UserFactory, TopicFactory, Topic } = models

let user = null
let admin = null

before(async () => {
  user = await UserFactory.create()
  admin = await UserFactory.create()
})

test('check if a topic can be inserted', async ({ assert }) => {
  const topic = await TopicFactory.create({
    user_id: user.id
  })

  const inDatabase = await Topic.find(topic.id)
  assert.exists(inDatabase)
})

test('makes sure the relations return the correct models', async ({ assert }) => {
  const topic = await TopicFactory.create({
    user_id: user.id
  })

  const openedByUser = await topic.user().fetch()
  assert.exists(openedByUser)
  assert.deepEqual(openedByUser, user)
})
