'use strict'
const { validateAll } = use('Validator')

const Organization = use('App/Models/Organization')
const User = use('App/Models/User')

class RegistrationController {
  index({ view }) {
    return view.render('auth.register')
  }

  async register({ request, response, session }) {
    /**
     * Validating user input.
     */
    const validation = await validateAll(
      request.post(),
      {
        'organization.name': 'required',
        'organization.slug':
          'required|regex:^([a-z0-9]+(-[a-z0-9])?)+$|unique:organizations,slug',
        'user.name': 'required',
        'user.email': 'required|email',
        'user.password': 'required|min:6'
      },
      {
        'organization.slug.regex':
          'Your organization address may only contain a combination of lowercase letters and numbers, separated by hyphens.'
      }
    )

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    /**
     * Persist data models.
     */
    const { user: userData, organization: organizationData } = request.post()

    organizationData.external_id = 'FOR_TESTING_ONLY_TO_BE_REMOVED'
    const organization = await Organization.create(organizationData)

    const user = new User(userData)

    userData.external_id = 'FOR_TESTING_ONLY_TO_BE_REMOVED'
    user.fill(userData)

    await organization.users().save(user)

    await user.setRole('owner')
    await user.setRole('admin')

    /**
     * Success.
     */
    session.flash({ success: 'Organization creation successful' })
    return response.redirect(`/organization/${organization.slug}/login`)
  }
}

module.exports = RegistrationController
