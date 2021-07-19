const Discord = require('discord.js')
const fs = require('fs')
const InterationManager = require('../lib/InteractionManager.js')
const InteractionManager = require('../lib/InteractionManager.js')
const { prefix } = require('../../config.json')

module.exports = {
  name: 'INTERACTION_CREATE',
  type: 'ws',
  execute: async (interaction, _, client) => {
    const adminIds = ['249515667252838421']

    const IM = InteractionManager(interaction, client)

    const commandName = interaction.data.name

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      )

    // check if command exist
    if (!command) return

    if (command.adminOnly) {
      if (!adminIds.includes(interaction.member.user.id)) {
        return IM.reply('Unauthorized')
      }
    }

    //check argument
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, <@${interaction.member.user.id}>!`

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
      }

      return IM.reply(reply)
    }

    // check cooldown
    const { cooldowns } = client

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000
    const UserId = interaction.member.user.id

    if (timestamps.has()) {
      const expirationTime = timestamps.get(UserId) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        const reply = `Please wait ${timeLeft.toFixed(
          1,
        )} more second(s) before reusing the \`${command.name}\` command.`

        IM.reply(reply)
      }
    }

    timestamps.set(UserId, now)
    setTimeout(() => timestamps.delete(UserId), cooldownAmount)

    const args =
      'options' in interaction.data
        ? interaction.data.options.map((e) => e.value)
        : []

    const guild = await client.guilds.fetch(interaction.guild_id)
    const guildMember = guild.members.cache.get(UserId)

    console.log('sth enter')

    try {
      command.execute({
        type: 1,
        send: IM.reply,
        client,
        guildMember,
        guild,
        args,
        interaction,
      })
    } catch (error) {
      console.error(error)
      IM.reply('Error')
    }
  },
}
