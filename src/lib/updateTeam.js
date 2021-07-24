module.exports = updateTeamList

const { teamChannelId } = require('../../config.json')

async function updateTeamList(guild) {
  const channel = guild.channels.cache.find((e) => e.id === teamChannelId)

  const roles = [...guild.roles.cache.values()].filter((e) =>
    e.name.startsWith('Team'),
  )

  const messages = (await channel.messages.fetch({ limit: 100 })).filter(
    // message with team mentions
    (message) => message.mentions.roles.first.name.startsWith('Team'),
  )

  // make new one
  if (messages.length !== roles.length) {
    roles.forEach((role) => {
      // TODO
      const teamName = ''
      const members = [...role.members.values()].join(', ')

      channel.send(`${role} ${teamName} — ${members}`)
    })
  }

  // update current one
  else {
  }
}
