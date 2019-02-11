'use strict'
const sinon = require('sinon')

const { test, before, beforeEach } = use('Test/Suite')(
  'Authorize User To Be Within Organization'
)
const { OrganizationFactory } = models

const WithinOrganization = use('App/Middleware/WithinOrganization')

let next = null
let handle = null
let middleware = null
let organization = null
let share = null

before(async () => {
  organization = await OrganizationFactory.create()
})

beforeEach(async () => {
  next = sinon.fake()
  share = sinon.fake()

  handle = {
    auth: {
      user: {
        roles() {
          return {
            fetch() {
              return {
                rows: [
                  {
                    key: 'admin'
                  }
                ]
              }
            }
          }
        }
      }
    },
    request: {
      organization
    },
    view: {
      share
    }
  }

  middleware = new WithinOrganization()
})

test('makes sure the authenticated user is part of the same organization', async ({
  assert
}) => {
  handle.auth.user.organization_id = organization.id

  await middleware.handle(handle, next)
  assert.isTrue(next.called, 'next() was not called')

  const shareViewHasRole = share.args[0][0]
  assert.exists(shareViewHasRole)
  assert.exists(shareViewHasRole.hasRole)

  assert.isTrue(shareViewHasRole.hasRole('admin'))
  assert.isFalse(shareViewHasRole.hasRole('owner'))
})

test('makes sure the authenticated user does not access another organization', async ({
  assert
}) => {
  handle.auth.user.organization_id = -1

  let pass = true
  try {
    await middleware.handle(handle, next)
    pass = false
  } catch (e) {
    // continue regardless of error
  }

  assert.isOk(pass, 'middleware did not prevent user from accessing resource')
  assert.isFalse(next.called, 'next() was not called')
})
