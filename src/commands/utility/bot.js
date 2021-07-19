module.exports = {
  name: 'bot',
  slash: {
    registerData: {
      guildOnly: true,
      data: {
        name: 'bot',
        description: 'Get bot info',
      },
    },
  },
  execute({ send }) {
    send(
      "I'm a mindless stupid bot with a ``stp `` prefix (or you can use  ``/`` instead).",
    )
  },
}
