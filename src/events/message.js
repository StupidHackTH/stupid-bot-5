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
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()
    const guildMember = message.guild.members.cache.get(message.author.id)

    let mentions = {
      users: [],
      channels: [],
      roles: [],
    }
    // change from user to guildmember
    ;[...message.mentions.users.values()].forEach((e) =>
      mentions.users.push(message.guild.members.cache.get(e.id)),
    )
    ;[...message.mentions.channels.values()].forEach((e) =>
      mentions.channels.push(message.guild.channels.cache.get(e.id)),
    )
    ;[...message.mentions.roles.values()].forEach((e) =>
      mentions.roles.push(message.guild.roles.cache.get(e.id)),
    )

    try {
      await Executor(commandName, {
        type: 0,
        client: message.client,
        send: (s, ...args) => message.channel.send(s, ...args),
        guild: message.guild,
        member: message.author,
        channel: message.channel,
        guildMember,
        mentions,
        args,
        message,
      })
    } catch (e) {
      console.error(e)
    }
  },
}
