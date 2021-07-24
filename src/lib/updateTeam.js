module.exports = updateTeamList

const { teamChannelId } = require('../../config.json')

async function updateTeamList(oldguild) {
  // refetch in case user pass old guild
  const guild = await oldguild.fetch()

  const channel = guild.channels.cache.find((e) => e.id === teamChannelId)

  const roles = [...guild.roles.cache.values()].filter((e) =>
    e.name.startsWith('Team'),
  )

  const messageList = await channel.messages.fetch({ limit: 100 })

  const messages = [...messageList.values()].filter((e) =>
    [...e.mentions.roles.values()][0].name.startsWith('Team'),
  )

  console.log(`messages role: ${messages.length}, roles: ${roles.length}`)

  // make new one
  if (messages.length !== roles.length) {
    messages.forEach((message) => {
      message.delete()
    })

    roles.forEach((role) => {
      // TODO
      const teamName = ''
      const members = [...role.members.values()].join(', ')

      channel.send(`${role} ${teamName} — ${members}`)
    })
  }

  // update current one
  else {
    messages.forEach((message) => {
      const role = message.mentions.roles.first()
      const teamName = ''
      const members = [...role.members.values()].join(', ')

      message.edit(`${role} ${teamName} — ${members}`)
    })
  }
}
