'use strict'

const StatsD = require('node-statsd')

const client = new StatsD({
  host: 'localhost',
  port: '8125',
  global_tags: ['ticketing-system']
})

module.exports = client
