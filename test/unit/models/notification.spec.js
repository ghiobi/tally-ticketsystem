'use strict'

const { test } = use('Test/Suite')('Notification Model')
const { Notification } = models

test('make sure data is persisted to database as json, and retrieved as json', async ({ assert }) => {
  const notification = await Notification.create({
    type: 'type',
    read: false,
    data: {
      name: 'hey hey'
    },
    user_id: 1
  })

  assert.equal(notification.data.name, 'hey hey')

  const persisted = await Notification.find(notification.id)

  assert.equal(persisted.data.name, 'hey hey')

  persisted.data = { status: 'new object' }
  await persisted.save()

  assert.equal(persisted.data.status, 'new object')
})
