const Embed = require('../../lib/Embed')

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
  async execute({ send, guildMember, guild }) {
    const teamRole = guildMember.roles.cache.find((r) =>
      r.name.startsWith('Team'),
    )
    if (teamRole) {
      await guildMember.roles.remove(teamRole)
      const role = await guild.roles.fetch(teamRole.id)
      send(`${guildMember} left ${teamRole}`)
      if (role.members.size === 0) {
        return send(Embed.SendSuccess("Leave Team", `${teamRole} now has no one`))
      } else {
        return send(Embed.SendSuccess(
          "Leave Team",
          `${teamRole} now has: ${[...role.members.values()].join(', ')}`,
        ))
      }
    }
    return send(Embed.SendError("Leave Team", `You don't have a team, ${guildMember}.`))
  },
}
