module.exports = {
  name: 'ping',
  description: 'Information about the arguments provided.',
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
