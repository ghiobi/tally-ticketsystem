'use strict'

const { WebClient } = require('@slack/client')
const { ServiceProvider } = require('@adonisjs/fold')

/**
 * Registers the WebClient from the @slack/client npm module.
 */
class SlackProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    this.app.singleton('Slack/WebClient', (app) => {
      const Config = app.use('Config')
      return new (require('./WebClient'))(Config, WebClient)
    })
  }
}

module.exports = SlackProvider
