<template>
  <div class="notification">
    <div class="notification-title">
      SYSTEM MESSAGE <small class="text-muted">{{ notification.created_at }}</small>
    </div>
    <div class="notification-body">{{ notification.data.message }}</div>
  </div>
</template>

<script>
export default {
  name: 'NotificationMessage',
  props: ['notification']
}
</script>

<style></style>
