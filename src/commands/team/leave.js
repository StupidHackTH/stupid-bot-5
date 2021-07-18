module.exports = {
  name: 'leave',
  description: 'leave your team',
  usage: 'leave',
  aliases: ['leaveteam'],
  async execute({ send, client, guildMember, guild }) {
    const teamRole = guildMember.roles.cache.find((r) =>
      r.name.startsWith('Team'),
    )
    if (teamRole) {
      await guildMember.roles.remove(teamRole)
      const role = await guild.roles.fetch(teamRole.id)
      send(`You left ${teamRole}`)
      if (role.members.size === 0) {
        return send(`${teamRole} now has no one`)
      } else {
        return send(
          `${teamRole} now has: ${[...role.members.values()].join(', ')}`,
        )
      }
    }
    return send(`You don't have a team, {$member}.`)
  },
}
