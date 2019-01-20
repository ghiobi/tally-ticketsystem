'use strict'

const { test, before } = use('Test/Suite')('User Organization Service')
const { UserFactory, OrganizationFactory } = models

const UserOrganizationService = use('App/Services/UserOrganizationService')

let organization = null

before(async () => {
  organization = await OrganizationFactory.create()
})

test('make sure a user can be initialized with an organization', async ({
  assert
}) => {
  await organization.users().save(await UserFactory.make({
    email: 'user.oranization.service@email.com'
  }))

  const user = await UserOrganizationService.findByEmail(organization, 'user.oranization.service@email.com')

  assert.exists(user)
  assert.equal(user.email, 'user.oranization.service@email.com')
})
