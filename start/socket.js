'use strict'

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

/* eslint-disable no-unused-vars */
const Ws = use('Ws')

Ws.channel('notifications', 'NotificationsController').middleware('auth')
