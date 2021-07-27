module.exports = {
  name: 'ping',
  description: 'pong.',
  slash: {
    registerData: {
      guildOnly: true,
      data: {
        name: 'ping',
        description: 'pong',
      },
    },
  },
  execute({ send }) {
    send('pong')
  },
}
