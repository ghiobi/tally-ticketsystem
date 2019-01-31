'use strict'

/**
 * Provides a web client instance for accessing APIs from Slack.
 */
class WebClient {
  /**
   * @param Config App configuration
   * @param WebClient WebClient provided by @slack/client
   */
  constructor(Config, WebClient) {
    this.tokens = Config.get('slack')

    this.WebClient = WebClient
  }

  /**
   * Authenticates user with a slack redirect code.
   *
   * @param code A one time token for retrieving the authenticated user.
   * @returns {Promise<WebAPICallResult>}
   */
  auth(code) {
    const { clientId, clientSecret } = this.tokens

    if (!clientId || !clientSecret) {
      throw new Error(
        'WebClient.auth - Slack client_id or client_secret were not set in the environment variables.'
      )
    }

    return new this.WebClient().oauth.access({
      client_id: clientId,
      client_secret: clientSecret,
      code
    })
  }

  /**
   * Creates a WebClient with a preconfigured access token.
   *
   * @param accessToken
   * @returns {WebClient}
   */
  create(accessToken) {
    return new this.WebClient(accessToken)
  }
}

module.exports = WebClient
