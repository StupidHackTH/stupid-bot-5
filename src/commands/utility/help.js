const Embed = require('../../lib/Embed')
const { prefix } = require('../../../config.json')

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
  usage: "help [<'all'> [command]]",
  execute({ send, args, message }) {
    const { commands } = message.client;

    if (args.length > 0) {
      const command = commands
        .find((command) => args[0] === command.name)

      if (!command) {
        return send(Embed.SendError("Command not found", `type \`${prefix}help\` or \`/help\` to get a list of all commands`))
      }

      const commandFields = Object.entries(command)
      .filter((field) => ['name', 'description', 'aliases', 'usage'].includes(field[0]))
      .map((field) => {
        return field[0] ===  'aliases' ? [field[0], field[1].join(", ")] : field
      })
      .map((field) => {
        return {
          name: `\`${field[0]}\``,
          value: `${field[1]}`
        }
      })

      send(Embed.Embed(
        `Help: ${command.name}`, `type \`${prefix}help\` or \`/help\` to get a list of all commands`, "#7f03fc", commandFields
      ))
    } else {
      const commandFields = commands.map((command) => {
        return {
          name: `\`${command.name}\``,
          value: `${command.description}`
        }
      })

      send(Embed.Embed(
        "Help", `type \`${prefix}help <command>\` or \`/help <command>\` to get more info about a command`, "#7f03fc", commandFields
      ))
    }
  },
}
