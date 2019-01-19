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
  async register () {
    const readdir = promisify(require('fs').readdir)
    const services = await readdir(path.join(__dirname, '..', 'app/Services'))
      .then((files) => files.map((file) => file.substring(0, file.lastIndexOf('.js'))))

    services.forEach((service) => {
      this.app.singleton(`App/Services/${service}`, () => {
        return new (require(`../app/Services/${service}`))
      })
    })
  }

}

module.exports = AppServiceProvider
