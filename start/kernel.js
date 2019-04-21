'use strict'

const logger = use('App/Logger')

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server')

logger.info('Registering middlewares...')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/Shield',
  'Adonis/Middleware/AuthInit',
  'App/Middleware/ConvertEmptyStringsToNull'
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  /* General Middleware */
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly',
  organization: 'App/Middleware/Organization',
  within: 'App/Middleware/WithinOrganization',
  IsSelfOrAdmin: 'App/Middleware/IsSelfOrAdmin',
  IsAdmin: 'App/Middleware/IsAdmin',
  IsOwner: 'App/Middleware/IsOwner',
  api: 'App/Middleware/ApiAuth',
  /* Page Guards */
  expenseDetailGuard: 'App/Middleware/Pageguards/ExpenseDetail',
  resetPassword: 'App/Middleware/Pageguards/ResetPassword',
  IsTicketOwner: 'App/Middleware/Pageguards/TicketBelongsToUser',
  IsTicketOwnerOrIsAdmin: 'App/Middleware/Pageguards/TicketBelongsToUserOrIsAdmin'
}

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = ['Adonis/Middleware/Static', 'Adonis/Middleware/Cors']

Server.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware)
