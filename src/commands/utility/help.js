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
      "Help", "", "#7f03fc",
      [
        {
          "name": "`stp add`",
          "value": "creates a new team if you don't have one"
        },
        {
          "name": "`stp add [user1] [user2] ...`",
          "value": "creates new team with mentioned user if you don't a have team / add member if you already have one"
        }
      ]
    ))
  },
}
