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
  Route.get('/forgot-password', 'Auth/ForgotPasswordController.index')
  Route.post('/forgot-password', 'Auth/ForgotPasswordController.recover')
})
  .prefix('organization/:organization')
  .middleware(['organization', 'guest'])

/**
 * Authenticated Organization Routes
 */
Route.group(() => {
  Route.get('/logout', 'Auth/LogoutController.logout')

  Route.get('/', 'Dashboard/DashboardController.index')

  Route.get('/expense', 'Expense/ExpenseController.index')

  Route.get('/expense/:expense_id', 'Expense/ExpenseController.viewExpense')

  Route.get('/account', 'Account/AccountController.index')
  Route.post('/account/password', 'Account/AccountController.password')

  Route.get('/ticket/create', 'Ticket/SubmitTicketController.index')
  Route.post('/ticket/create', 'Ticket/SubmitTicketController.submit').validator('StoreTicket')

  Route.get('/ticket/:ticket_id', 'Ticket/TicketController.index').middleware('accessTicket')
  Route.post('/ticket/:ticket_id', 'Ticket/TicketController.update').middleware('accessTicket')
  Route.post('/ticket/:ticket_id/reply', 'Ticket/TicketController.reply').middleware('accessTicket')
  Route.post('/ticket/:ticket_id/resolve', 'Ticket/TicketController.resolve').middleware('accessTicket')
  Route.post('/ticket/:ticket_id/reopen', 'Ticket/TicketController.reopen').middleware('accessTicket')
  Route.post('/ticket/:ticket_id/assign', 'Ticket/TicketController.assign').middleware('IsAdmin')
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

  Route.get('/users', 'Admin/UsersController.index')
  Route.post('/users/addAdmin', 'Admin/ManageAdminsController.addAdmin')
  Route.post('/users/removeAdmin', 'Admin/ManageAdminsController.removeAdmin').middleware(['IsOwner'])
})
  .prefix('organization/:organization/admin')
  .middleware(['organization', 'auth', 'within', 'IsAdmin'])

/**
 * Authenticated Organization API Routes
 */
Route.group(() => {
  Route.post('/tickets', 'Api/ApiTicketController.create').validator('StoreTicket')
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

  Route.get('/resetpassword', 'Auth/ForgotPasswordController.resetpage').middleware('resetpassword')
  Route.post('/resetpassword', 'Auth/ForgotPasswordController.resetByToken').middleware('resetpassword')
}).middleware(['guest'])
