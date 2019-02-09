'use strict'

const Client = use('Slack/WebClient')
const SlackService = use('App/Services/SlackService')

const Config = use('Config')

class SlackOAuthController {
  redirect({ response }) {
    const externalAppUrl = Config.get('app.externalAppUrl')
    const clientId = Config.get('slack.clientId')

    return response.redirect(
      'https://slack.com/oauth/authorize' +
        '?client_id=' +
        clientId +
        '&scope=users.profile:read,users:read,users:read.email' +
        '&redirect_uri=' +
        externalAppUrl +
        '/oauth/authenticate'
    )
  }

  async authenticate({ request, response, auth }) {
    const { access_token, user_id, team_id } = await Client.auth(
      request.input('code')
    )
    const client = Client.create(access_token)

    const user = await SlackService.authenticate(client, user_id, team_id)
    await auth.login(user)

    const organization = await user.organization().fetch()
    if (auth.user.hasRole('admin')) {
      return response.redirect(`/organization/${organization.slug}/admin`)
    } else {
      return response.redirect(`/organization/${organization.slug}`)
    }
  }
}

module.exports = SlackOAuthController
