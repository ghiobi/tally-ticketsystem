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

Route.on('/').render('home')

Route.get('/join', 'Auth/RegistrationController.index')
Route.post('/join', 'Auth/RegistrationController.register')

Route.group(() => {
  Route.get('/login', 'Auth/LoginController.index')
  Route.post('/login', 'Auth/LoginController.login')
})
  .prefix('organization/:organization')
  .middleware(['set.organization'])

Route.group(() => {
  Route.get('/', 'Dashboard/DashboardController.index')
  Route.get(
    '/feedback/:feedback_id',
    'Feedback/FeedbackController.index'
  ).middleware(['feedback.belongs.to.user'])
})
  .prefix('organization/:organization')
  .middleware(['set.organization', 'auth'])

Route.group(() => {
  Route.get('/', 'Organization/FindOrganizationController.index')
  Route.post('/', 'Organization/FindOrganizationController.find')
}).prefix('organization')

Route.group(() => {
  Route.get(
    '/tickets/user/:userId',
    'Ticket/TicketController.getUserTickets'
  ).middleware('IsSelfOrAdmin')
  Route.get(
    '/tickets/organization/:organizationId',
    'Ticket/TicketController.getOrganizationTickets'
  ).middleware('IsAdmin')
})
  .prefix('api')
  .middleware('auth')

Route.on('/403').render('error.403')
Route.on('/*').render('error.404')
