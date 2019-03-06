const Event = use('Event')
const EmailService = use('App/Services/EmailService')
const service = new EmailService()

Event.on('forgot::password', async ({ user, token }) => {
  // console.log(token)
  const encodedToken = encodeURIComponent(token)
  await service.sendTokenToResetPassword(user, encodedToken)
})
