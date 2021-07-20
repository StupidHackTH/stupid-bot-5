const { prefix } = require('../../config.json')
const Discord = require('discord.js')
const Executor = require('../lib/Executor.js')

module.exports = {
  name: 'message',
  type: 'on',
  async execute(message, client) {
    console.log(
      `[${new Date().toJSON()}] ${message.author.tag} ${JSON.stringify(
        message.content,
      )}`,
    )

    if (message.author.bot) return

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

    // parse context to Executor
    const mentions = parseMentions(message.mentions, message.guild)
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()
    const guildMember = message.guild.members.cache.get(message.author.id)

    try {
      await Executor(commandName, {
        type: 0,
        client: message.client,
        send: (s, ...args) => message.channel.send(s, ...args),
        guildMember,
        guild: message.guild,
        channel: message.channel,
        mentions,
        args,
        message,
      })
    } catch (e) {
      console.error(e)
    }
  },
}

function parseMentions(messageMention, guild) {
  let mentions = {
    users: [],
    channels: [],
    roles: [],
  }
  // change from user to guildmember
  ;[...messageMention.users.values()].forEach((e) =>
    mentions.users.push(guild.members.cache.get(e.id)),
  )
  ;[...messageMention.channels.values()].forEach((e) =>
    mentions.channels.push(guild.channels.cache.get(e.id)),
  )
  ;[...messageMention.roles.values()].forEach((e) =>
    mentions.roles.push(guild.roles.cache.get(e.id)),
  )
  return mentions
}
