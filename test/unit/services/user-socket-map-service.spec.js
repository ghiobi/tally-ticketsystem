'use strict'

const { test, beforeEach } = use('Test/Suite')('User Socket Map Service')

const UserSocketMapService = require('../../../app/Services/UserSocketMapService')
const sinon = require('sinon')

let userSocketMapService = null
let cacheMocked = null

beforeEach(() => {
  cacheMocked = {
    set: sinon.fake(),
    get: sinon.fake.returns(['socket_1'])
  }

  userSocketMapService = new UserSocketMapService(cacheMocked)
})

test('make sure it removes a socket from the cache', async ({ assert }) => {
  userSocketMapService.remove(1, 'socket_1')

  assert.equal(cacheMocked.set.args[0][0], 'usms_1')
  assert.deepEqual(cacheMocked.set.args[0][1], [])
})

test('make sure it returns the correct array of socket ids', async ({ assert }) => {
  const result = userSocketMapService.get(5)

  assert.deepEqual(result, ['socket_1'])
})

test('make sure a socket id can be added to the map and retreived', async ({ assert }) => {
  userSocketMapService.add(1, 'socket_2')

  assert.equal(cacheMocked.set.args[0][0], 'usms_1')
  assert.deepEqual(cacheMocked.set.args[0][1], ['socket_1', 'socket_2'])
})
