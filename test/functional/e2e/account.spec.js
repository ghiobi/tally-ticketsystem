'use strict'

const { test, trait, before } = use('Test/Suite')('Account integration test')

const { OrganizationFactory, UserFactory } = models

trait('Test/Browser', {
  defaultViewport: {
    width: 1280,
    height: 720,
    isMobile: false
  },
  headless: true
})

let organization = null
let user = null

before(async () => {
  organization = await OrganizationFactory.create({
    slug: 'account-e2e'
  })

  user = await UserFactory.make({
    email: 'account-e2e@email.com',
    password: 'userpassword'
  })
  await organization.users().save(user)
})

test('Login in with a user account should lead to the dashboard page', async ({ browser }) => {
  const loginpage = await browser.visit('/organization')
  await loginpage
    .waitForElement('#organization-input')
    .type('#organization-input', 'account-e2e')
    .click('#organization-workspace-submit')
    .waitForElement('#form__email')
    .waitForElement('#form__password')
    .type('#form__email', user.email)
    .type('#form__password', 'userpassword')
    .click('#sign-in-btn')
    .waitFor(500)

  const accountpage = await browser.visit(`/organization/${organization.slug}/account`)

  await accountpage
    .waitFor(500)
    .assertExists('#form__newPassword')
    .assertExists('#form__confirmPassword')
}).timeout(60000)
