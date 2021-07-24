const Discord = require('discord.js')
const { prefix, botChannelFilter } = require('../../config.json')
const Embed = require('./Embed')

module.exports = Executor

async function Executor(commandName, context) {
  if (context.guildMember.bot) return

  const adminIds = ['249515667252838421']

  const { channel, client, send, member, args } = context

  const channelReg = new RegExp('bot')

  const command =
    context.client.commands.get(commandName) ||
    context.client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
    )

  if (!command) return

  // bot room only
  if (botChannelFilter && !channelReg.test(channel.name)) {
    return send(Embed.Error("Executor", 'command can only be used in bot room'))
  }

  // admin Only Command
  if (command.adminOnly) {
    if (!adminIds.includes(member.id)) {
      return message.reply('Unauthorized')
    }
  }

  if (command.guildOnly && channel.type === 'dm') {
    return send(Embed.Error("Executor", "I can't execute that command inside DMs!"))
  }

  if (command.args && !context.args.length) {
    let reply = `You didn't provide any arguments, ${member}!`

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    }

    return send(Embed.Error("Executor", reply))
  }

  const { cooldowns } = client

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(member.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return send(
        `Please wait ${timeLeft.toFixed(
          1,
        )} more second(s) before reusing the \`${command.name}\` command.`,
      )
    }
  }

  timestamps.set(member.id, now)
  setTimeout(() => timestamps.delete(member.id), cooldownAmount)

  try {
    command.execute(context)
  } catch (error) {
    console.error(error)
    message.reply('There was an error trying to execute that command!')
  }
}
