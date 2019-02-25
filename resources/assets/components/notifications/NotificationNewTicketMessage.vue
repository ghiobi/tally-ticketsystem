<template>
  <div class="notification">
    <div class="notification-title">NEW TICKET MESSAGE {{ notification.created_at }}</div>
    <div class="notification-body">
      Your ticket,
      <a :href="uri + notification.data.ticket.id + ''"
        ><strong>{{ notification.data.ticket.title }}</strong></a
      >, received a new message.
    </div>
  </div>
</template>

<script>
import { FULL_ORGANIZATION_URI } from '../../scripts'

export default {
  name: 'NotificationNewTicketMessage',
  props: ['notification'],
  data: () => {
    return {
      uri: FULL_ORGANIZATION_URI + '/ticket/'
    }
  }
}
</script>

<style lang="scss" scoped>
.notification {
  border-left-color: var(--red);
}
</style>
