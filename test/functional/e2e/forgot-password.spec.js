'use strict'

const { test, trait, before } = use('Test/Suite')('Forgot Password integration test')

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

test('Clicking Forgot Password from Login should lead to the password forgot-password page', async ({ browser }) => {
  const loginpage = await browser.visit(`/organization/${organization.slug}`)
  await loginpage
    .waitForElement('#forgot-password')
    .click('#forgot-password')
    .waitForElement('#form__email')
    .assertHas('FORGOT YOUR PASSWORD?')
}).timeout(60000)
