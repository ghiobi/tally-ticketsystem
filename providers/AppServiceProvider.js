'use strict'

const path = require('path')
const { promisify } = require('util')

const { ServiceProvider } = require('@adonisjs/fold')

/**
 * Registers all app related services in App/Services
 */
class AppServiceProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  async register() {
    let services = []

    try {
      /**
       * Looks up in the App/Services folder for services and creates an array of their names.
       * ['NameService', 'AnotherNameService']. An exception is thrown when no files are found.
       */
      services = await promisify(require('fs').readdir)(
        path.join(__dirname, '..', 'app/Services')
      ).then((files) =>
        files.map((file) => file.substring(0, file.lastIndexOf('.js')))
      )
    } catch (e) {}

    services.forEach((service) => {
      this.app.singleton(`App/Services/${service}`, () => {
        return new (require(`../app/Services/${service}`))()
      })
    })
  }
}

module.exports = AppServiceProvider
