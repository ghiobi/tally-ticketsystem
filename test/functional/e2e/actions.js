module.exports = {
  login: async function(browser, org, email, password) {
    const loginpage = await browser.visit('/organization')
    return loginpage
      .waitForElement('#organization-input')
      .type('#organization-input', org)
      .click('#organization-workspace-submit')
      .waitForElement('#form__email')
      .waitForElement('#form__password')
      .type('#form__email', email)
      .type('#form__password', password)
      .click('#sign-in-btn')
      .waitFor(500)
  }
}
