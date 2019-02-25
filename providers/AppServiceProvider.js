'use strict'
const moment = require('moment')

const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const { ServiceProvider } = require('@adonisjs/fold')

/**
 * Registers all app related services in App/Services
 */
class AppServiceProvider extends ServiceProvider {
  boot() {
    const logsDir = path.join(__dirname, '../logs')

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir)
    }
  }
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  async register() {
    await this.registerViewGlobals()
    await this.registerServices()
    await this.registerCache()
  }

  registerViewGlobals() {
    const View = use('View')

    View.global('humanTime', (dateTime) => {
      return moment(dateTime).fromNow()
    })
  }

  async registerServices() {
    let services = []

    try {
      /**
       * Looks up in the App/Services folder for services and creates an array of their names.
       * ['NameService', 'AnotherNameService']. An exception is thrown when no files are found.
       */
      services = await promisify(require('fs').readdir)(path.join(__dirname, '..', 'app/Services')).then((files) =>
        files.map((file) => file.substring(0, file.lastIndexOf('.js')))
      )
    } catch (e) {
      // Continue regardless of error
    }

    services.forEach((service) => {
      this.app.singleton(`App/Services/${service}`, () => {
        return new (require(`../app/Services/${service}`))()
      })
    })
  }

  registerCache() {
    this.app.singleton('Cache/Strategy', () => {
      return new Map()
    })

    this.app.singleton('Cache', () => {
      // TODO: Create Redis cache strategy.
      const Engine = use('Cache/Strategy')
      return new (require('./cache/Cache'))(Engine)
    })
  }
}

module.exports = AppServiceProvider
