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
  execute({ send, args, message }) {
    const { commands } = message.client;

    if (args.length > 0) {
      const commandFields = commands
        .filter((command) => args.includes(command.name))
        .map((command) => {
          return {
            "name": `\`${command.name}\``,
            "value": `${command.description}`
          }
        })

      send(Embed.Embed(
        "Help", "", "#7f03fc", [commandFields]
      ))
    } else {
      const commandFields = commands.map((command) => {
        return {
          "name": `\`${command.name}\``,
          "value": `${command.description}`
        }
      })

      send(Embed.Embed(
        "Help", "", "#7f03fc", [commandFields]
      ))
    }
  },
}
