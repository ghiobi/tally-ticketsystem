'use strict'

const { test, trait, before } = use('Test/Suite')('Homepage integration test')

const { OrganizationFactory, UserFactory, TicketFactory } = models

trait('Test/Browser', {
  defaultViewport: {
    width: 1280,
    height: 720,
    isMobile: false
  },
  headless: true,
  slowMo: 100
})

test('Visit home page', async ({ browser }) => {
  const page = await browser.visit('/')
  await page.assertHas('Tally, A Bot')
}).timeout(0)

test('Clicking "Sign in" on homepage redirects to organization sign in page', async ({
  browser
}) => {
  const page = await browser.visit('/')
  await page
    .waitForElement('#organization-signin')
    .click('#organization-signin')
    .waitFor(500)
    .assertPath('/organization')
    .assertHas('SIGN INTO YOUR ORGANIZATION')
}).timeout(0)
