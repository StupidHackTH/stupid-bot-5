const Embed = require('../../lib/Embed')

module.exports = {
  name: 'help',
  slash: {
    registerData: {
      guildOnly: true,
      data: {
        name: 'help',
        description: 'Get bot info',
      },
    },
  },
  execute({ send }) {
    send(Embed.Embed(
      "Help",
      "stp add - create team if you don't have one\n" +
        "stp add [user1] [user2] ... - create team with mentioned user if you don't have team / add member if you already have team",
    ))
  },
}
