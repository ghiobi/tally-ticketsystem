'use strict'

class DashboardController {
  async index({ view, auth }) {
    const data = {
      open: [
        { text: 'Tally has really sped things up', author: 'Eric Xiao' },
        { text: 'Lorem ipsum yeah?', author: 'Laurendy Lam' }
      ],
      inprogress: [
        { text: 'Hey can we get this feature', author: 'Brian Vo' },
        { text: 'Tally is the best', author: 'Nathan Chao' },
        { text: 'Wow, this is really useful', author: 'Kevin Zhang' },
        {
          text: 'Can this be integrated with slack bots?',
          author: 'Michel Chatmajian'
        }
      ],
      closed: [{ text: 'Thanks Tally!', author: 'Justin Leger' }]
    }
    return Promise.all([
      auth.user.hasRole('admin'),
      auth.user.hasRole('owner')
    ]).then((values) => {
      if (values.includes(true)) {
        return view.render('dashboard.admin', data)
      } else {
        return view.render('dashboard.main')
      }
    })
  }
}

module.exports = DashboardController
