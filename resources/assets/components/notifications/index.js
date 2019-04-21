import Vue from 'vue'

import NotificationCenter from './NotificationCenter.vue'
import NotificationMessage from './NotificationMessage.vue'
import NotificationNewTicketMessage from './NotificationNewTicketMessage.vue'

Vue.component('notification-message', NotificationMessage)
Vue.component('notification-new-ticket-message', NotificationNewTicketMessage)

new Vue({
  el: document.getElementById('notification-center'),
  render: (h) => h(NotificationCenter)
})
