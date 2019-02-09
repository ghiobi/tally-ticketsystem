'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Slack Client Id
  |--------------------------------------------------------------------------
  |
  | A token provided by slack for authenticating requests.
  |
  */
  clientId: Env.get('SLACK_CLIENT_ID'),

  /*
  |--------------------------------------------------------------------------
  | Slack Client Secret
  |--------------------------------------------------------------------------
  |
  | A token provided by slack for authenticating requests.
  |
  */
  clientSecret: Env.get('SLACK_CLIENT_SECRET'),

  /*
  |--------------------------------------------------------------------------
  | Slack Signing Secret
  |--------------------------------------------------------------------------
  |
  | A token provided by slack for authenticating requests.
  |
  */
  secret: Env.get('SLACK_SIGNING_SECRET'),

  /*
  |--------------------------------------------------------------------------
  | Slack Access Token
  |--------------------------------------------------------------------------
  |
  | A token provided by slack for authenticating requests on behalf of the
  | application.
  |
  */
  accessToken: Env.get('SLACK_ACCESS_TOKEN')
}
