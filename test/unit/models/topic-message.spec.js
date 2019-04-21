'use strict'

const { test, before } = use('Test/Suite')('Message Model')
const { UserFactory, TopicFactory, TopicMessageFactory, TopicMessage } = models

let topic = null
let user = null

before(async () => {
  user = await UserFactory.create()

  topic = await TopicFactory.create({
    user_id: user.id
  })
})

test('check if a message can be inserted', async ({ assert }) => {
  const message = await TopicMessageFactory.create({
    user_id: user.id,
    topic_id: topic.id
  })

  const inDatabase = await TopicMessage.find(message.id)
  assert.exists(inDatabase)
})

test('makes sure the relations return the correct models', async ({ assert }) => {
  const message = await TopicMessageFactory.create({
    user_id: user.id,
    topic_id: topic.id
  })

  const writer = await message.user().fetch()
  assert.isNotNull(writer)
  assert.deepEqual(writer, user)

  const fetchedTicket = await message.topic().fetch()
  assert.isNotNull(fetchedTicket)
  assert.deepEqual(fetchedTicket['$attributes'], topic['$attributes'])
})
