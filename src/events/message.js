const { prefix } = require('../../config.json')
const Discord = require('discord.js')

module.exports = {
  name: 'message',
  type: 'on',
  async execute(message, client) {
    const adminIds = ['249515667252838421']

    console.log(
      `[${new Date().toJSON()}] ${message.author.tag} ${JSON.stringify(
        message.content,
      )}`,
    )

    // arbitrary code execution
    if (message.content.startsWith(';')) {
      if (!adminIds.includes(message.author.id)) {
        message.reply('Unauthorized')
        return
      }
      const code = message.content.slice(1)
      const context = {
        message,
        client,
        guild: message.guild,
      }
      try {
        message.reply(
          String(
            await new Function(
              '__code',
              ...Object.keys(context),
              'try { return eval(__code) } catch (error) { return "```\\n" + (error.stack || error) + "\\n```" }',
            )(code, ...Object.values(context)),
          ),
        )
      } catch (error) {
        message.reply(String(error))
      }
      return
    }
    // detect command
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      )

    if (!command) return

    if (command.adminOnly) {
      if (!adminIds.includes(message.author.id)) {
        return IM.reply('Unauthorized')
      }
    }

    if (command.guildOnly && message.channel.type === 'dm') {
      return message.reply("I can't execute that command inside DMs!")
    }

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
      }

      return message.channel.send(reply)
    }

    const { cooldowns } = client

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        return message.reply(
          `Please wait ${timeLeft.toFixed(
            1,
          )} more second(s) before reusing the \`${command.name}\` command.`,
        )
      }
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

    const guildMember = message.guild.members.cache.get(message.author.id)

    try {
      command.execute({
        type: 0,
        client: message.client,
        send: (s, ...args) => message.channel.send(s, ...args),
        guild: message.guild,
        member: message.author,
        guildMember,
        message,
        args,
      })
    } catch (error) {
      console.error(error)
      message.reply('There was an error trying to execute that command!')
    }
  },
}
