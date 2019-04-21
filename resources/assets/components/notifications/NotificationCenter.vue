<template>
  <div class="notification-center dropdown">
    <a
      class="notification-center_inline dropdown-toggle"
      id="dropdownMenuButton"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <span class="notification-center__count">{{ this.notifications.length }}</span> <i class="fa fa-bell"></i>
    </a>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <div v-if="notifications.length" class="notification-clear">
        <span v-on:click="clear()" class="badge badge-info"><span class="fa fa-times"></span> Clear Notifications</span>
      </div>
      <div class="notification-container">
        <div class="dropdown-item notification-item" v-for="notification in this.notifications">
          <div v-bind:is="'notification-' + notification.type" v-bind:notification="notification"></div>
        </div>
      </div>
      <div class="p-2 text-center" v-if="!notifications.length">You don't have any notifications.</div>
    </div>
    <audio ref="ping" src="/audio/notification.mp3"></audio>
  </div>
</template>

<script>
import { CONNECTION, NOTIFICATION_CHANNEL } from '../../scripts/sockets'
import { FULL_ORGANIZATION_URI } from '../../scripts'

export default {
  name: 'NotificationCenter',
  data: () => {
    return {
      notifications: []
    }
  },
  created() {
    this.init()
  },
  computed: {
    count() {
      return this.$store.state.count
    }
  },
  methods: {
    init() {
      const socket = CONNECTION.subscribe(NOTIFICATION_CHANNEL.NAME)
      socket.on(NOTIFICATION_CHANNEL.START_EVENT, (notifications) => {
        this.notifications = notifications || []
      })
      socket.on(NOTIFICATION_CHANNEL.NEW_NOTIFICATION_EVENT, (notification) => {
        this.notifications.unshift(notification)
        this.ping()
      })
    },
    ping() {
      this.$refs.ping.currentTime = 0
      this.$refs.ping.play()
    },
    clear() {
      $.post(`${FULL_ORGANIZATION_URI}/account/notifications/clear`, {
        success: () => {
          this.notifications = []
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
  width: 330px;
  line-height: normal;
}
.notification-clear {
  text-align: center;
  margin-bottom: 6px;
  > .badge {
    cursor: pointer;
  }
}
.notification-container {
  max-height: 600px;
  overflow-y: scroll;
}
.notification-item {
  white-space: normal;
}
.notification-center {
  position: relative;
}
.notification-center__count {
  position: absolute;
  background: #1abc9c;
  border-radius: 25%;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  height: 13px;
  line-height: 10px;
  padding: 2px 4px;
  left: 8px;
  top: -4px;
}
.notification-center_inline {
  display: inline;
  position: relative;

  &:after {
    content: none;
  }
}
</style>
