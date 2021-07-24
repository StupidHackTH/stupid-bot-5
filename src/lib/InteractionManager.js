module.exports = InterationManager

async function InterationManager(interaction, client) {
  const guild = await client.guilds.fetch(interaction.guild_id)
  const guildMember = guild.members.cache.get(interaction.member.user.id)
  const channel = guild.channels.cache.get(interaction.channel_id)

  const reply = (message) => {
    if (typeof message === 'string') {
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: message,
          },
        },
      })
    } else if (typeof message === 'object') {
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            embeds: [message.embed],
          },
        },
      })
    } else {
      throw new TypeError('Unknown message format')
    }
  }

  const args = interaction.data?.options?.map((e) => e.value)

  let mentions = {
    users: [],
    channels: [],
    roles: [],
  }

  interaction.data?.options?.forEach((e) => {
    switch (e.type) {
      case 6:
        mentions.users.push(guild.members.cache.get(e.value))
        break
      case 7:
        mentions.channels.push(guild.channels.cache.get(e.value))
        break
      case 8:
        mentions.roles.push(guild.roles.cache.get(e.value))
        break
    }
  })

  return { reply, mentions, args, guild, guildMember, channel }
}
