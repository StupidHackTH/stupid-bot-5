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

    const role = await guild.roles.fetch(teamRole.id)
    await client.database
      .collection('Teams')
      .doc(teamRole.name)
      .update({
        members: [...role.members.values()].map((e) => e.id).filter((id) => id !== guildMember.user.id)
      })
      .then(() => { 
        console.log("Removed user from team database")
      })
      .catch((err) => {
        console.error("Error wrting to database", err)
      })

    updateTeamList(guild)

    send(Embed.SendSuccess('Leave Team successfully'))
  },
}
