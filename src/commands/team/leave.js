const Embed = require('../../lib/Embed')
const updateTeamList = require('../../lib/updateTeam')

module.exports = {
  name: 'leave',
  description: 'leave your team',
  usage: 'leave',
  aliases: ['leaveteam'],
  guildOnly: true,
  slash: {
    registerData: {
      guildOnly: true,
      data: {
        name: 'leave',
        description: 'leave your team',
      },
    },
  },
  async execute({ client, send, guildMember, guild }) {
    const teamRole = guildMember.roles.cache.find((r) =>
      r.name.startsWith('Team'),
    )
    if (!teamRole) {
      return send(
        Embed.SendError('Leave Team', `You don't have a team, ${guildMember}.`),
      )
    }

    await guildMember.roles.remove(teamRole)

    updateTeamList(guild)

    send(Embed.SendSuccess('Leave Team successfully'))
  },
}
