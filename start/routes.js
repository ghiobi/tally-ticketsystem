'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/**
 * Public Organization Routes
 */
Route.group(() => {
  Route.get('/login', 'Auth/LoginController.index')
  Route.post('/login', 'Auth/LoginController.login')
})
  .prefix('organization/:organization')
  .middleware(['organization', 'guest'])

/**
 * Authenticated Organization Routes
 */
Route.group(() => {
  Route.get('/logout', 'Auth/LogoutController.logout')

  Route.get('/', 'Dashboard/DashboardController.index')

  Route.get('/ticket/:ticket_id', 'Ticket/TicketController.index').middleware([
    'ticket.belongs.to.user'
  ])
  Route.get('/submit/ticket', 'Ticket/SubmitTicketController.index')
  Route.post('/submit/ticket', 'Ticket/SubmitTicketController.submit')

  Route.post('/ticket/:ticket_id', 'Ticket/TicketController.reply')
  Route.post('/ticket/:ticket_id/reply', 'Ticket/TicketController.reply')
  Route.post('/ticket/:ticket_id/resolve', 'Ticket/TicketController.resolve')
  Route.post('/ticket/:ticket_id/reopen', 'Ticket/TicketController.reopen')
})
  .prefix('organization/:organization')
  .middleware(['organization', 'auth', 'within'])

/**
 * Authenticated Organization Routes on Admin
 */
Route.group(() => {
  Route.get('/', 'Admin/DashboardController.index')

  Route.get('/token', 'Admin/ApiTokenController.index')
  Route.post('/token', 'Admin/ApiTokenController.generate')
})
  .prefix('organization/:organization/admin')
  .middleware(['organization', 'auth', 'within', 'IsAdmin'])

/**
 * Authenticated Organization API Routes
 */
Route.group(() => {
  Route.post('/tickets', 'Api/ApiTicketController.create')
  Route.get('/tickets/:ticket_id', 'Api/ApiTicketController.ticket')

  Route.get('/tickets', 'Api/ApiTicketController.organizationTickets')
  Route.get('/tickets/user/:user_id', 'Api/ApiTicketController.userTickets')
})
  .prefix('organization/:organization/api')
  .middleware(['organization', 'api'])

/**
 * Public Routes
 */
Route.group(() => {
  Route.on('/').render('home')

  Route.get('/join', 'Auth/RegistrationController.index')
  Route.post('/join', 'Auth/RegistrationController.register')

  Route.get('/organization', 'Organization/FindOrganizationController.index')
  Route.post('/organization', 'Organization/FindOrganizationController.find')

  Route.get('/oauth', 'Auth/SlackOAuthController.redirect')
  Route.get('/oauth/authenticate', 'Auth/SlackOAuthController.authenticate')
}).middleware(['guest'])
