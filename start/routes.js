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
  .middleware(['set.organization', 'guest'])

/**
 * Authenticated Organization Routes
 */
Route.group(() => {
  Route.get('/logout', 'Auth/LogoutController.logout')
  Route.get('/', 'Dashboard/DashboardController.index')

  Route.get(
    '/feedback/:feedback_id',
    'Feedback/FeedbackController.index'
  ).middleware(['feedback.belongs.to.user'])
  Route.post('/feedback/:feedback_id', 'Feedback/FeedbackController.reply')
  Route.get(
    '/api/tickets/user/:userId',
    'Ticket/TicketController.getUserTickets'
  ).middleware('IsSelfOrAdmin')
  Route.get(
    '/api/tickets',
    'Ticket/TicketController.getOrganizationTickets'
  ).middleware('IsAdmin')
})
  .prefix('organization/:organization')
  .middleware(['set.organization', 'auth'])

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

Route.get(
  '/api/tickets/:ticketId/messages',
  'Ticket/MessageController.getTicketMessages'
)

Route.on('/403').render('403')
