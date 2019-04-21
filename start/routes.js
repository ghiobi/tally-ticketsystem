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
  Route.get('/expense/:expense_id', 'Expense/ExpenseController.viewExpense').middleware('expenseDetailGuard')
  Route.delete('/expense', 'Expense/ExpenseController.deleteExpense')

  Route.get('/expense/update/:expense_id', 'Expense/UpdateExpenseController.index')
  Route.post('/expense/update/:expense_id', 'Expense/UpdateExpenseController.update')

  Route.get('/newexpense', 'Expense/NewExpenseController.index')
  Route.post('/newexpense/submit', 'Expense/NewExpenseController.submit')
  Route.post('/newexpense/scan', 'Expense/NewExpenseController.scanReceipt')

  Route.get('/account', 'Account/AccountController.index')
  Route.post('/account/password', 'Account/AccountController.password')

  Route.get('/ticket/create', 'Ticket/SubmitTicketController.index')
  Route.post('/ticket/create', 'Ticket/SubmitTicketController.submit').validator('StoreTicket')

  Route.get('/ticket/:ticket_id', 'Ticket/TicketController.index').middleware('ticketGuard')
  Route.post('/ticket/:ticket_id', 'Ticket/TicketController.update').middleware('ticketGuard')
  Route.post('/ticket/:ticket_id/reply', 'Ticket/TicketController.reply').middleware('ticketGuard')
  Route.post('/ticket/:ticket_id/resolve', 'Ticket/TicketController.resolve').middleware('ticketGuard')
  Route.post('/ticket/:ticket_id/reopen', 'Ticket/TicketController.reopen').middleware('ticketGuard')
  Route.post('/ticket/:ticket_id/assign', 'Ticket/TicketController.assign').middleware('IsAdmin')

  Route.get('/forum', 'Forum/ForumController.index')
  Route.get('/forum/create', 'Forum/ForumController.createpage')
  Route.post('/forum/create', 'Forum/ForumController.create')

  Route.get('/forum/:topic_id', 'Forum/ForumController.topic')
  Route.post('/forum/:topic_id/reply', 'Forum/ForumController.topicreply')
})
  .prefix('organization/:organization')
  .middleware(['organization', 'auth', 'within'])

/**
 * Authenticated Organization Routes on Admin
 */
Route.group(() => {
  Route.get('/', ({ response }) => {
    response.redirect('admin/tickets')
  })
  Route.get('/tickets', 'Admin/DashboardController.index')

  Route.get('/token', 'Admin/ApiTokenController.index')
  Route.post('/token', 'Admin/ApiTokenController.generate')

  Route.get('/users', 'Admin/UsersController.index')
  Route.post('/users/addAdmin', 'Admin/ManageAdminsController.addAdmin')
  Route.post('/users/removeAdmin', 'Admin/ManageAdminsController.removeAdmin').middleware(['IsOwner'])

  Route.get('/expenses', 'Admin/ExpensesController.index')
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

  Route.get('/resetpassword', 'Auth/ForgotPasswordController.resetpage').middleware('resetPassword')
  Route.post('/resetpassword', 'Auth/ForgotPasswordController.resetByToken').middleware('resetPassword')
}).middleware(['guest'])
