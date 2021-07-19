module.exports = {
  name: 'add',
  description: 'add member to team',
  usage: 'add [user]',
  aliases: ['addteam', 'teamadd'],
  async execute({ send, guild, guildMember, message }) {
    const allRoles = [...guild.roles.cache.values()]
    const participantRole = allRoles.find((r) => r.name == 'Participant')
    const allParticipants = [...participantRole.members.values()]
    const mentionedParticipants = allParticipants.filter((m) => {
      return message.mentions.users.has(m.id) // && m.id !== message.author.id
    })

    // check if sender have participant role
    if (!participantRole.members.has(guildMember.id)) {
      return send("You don't have participant role.")
    }

    // check if mentioned user have participant role
    const RealParticipants = mentionedParticipants.filter((m) => {
      return m.roles.cache.has(participantRole.id)
    })

    if (message.mentions.users.size !== RealParticipants.length) {
      return send("Some of your member doesn't have participant role.")
    }

    // check if mentioned user don't have team
    const allowedParticipants = RealParticipants.filter((m) => {
      return !m.roles.cache.some((r) => r.name.startsWith('Team'))
    })

    if (message.mentions.users.size !== allowedParticipants.length) {
      return send(
        'Some of your member already have team. Please do `stupid leave` first',
      )
    }

    // find team
    let teamRole = undefined

    // sender don't have team
    if (!guildMember.roles.cache.some((e) => e.name.startsWith('Team'))) {
      // create team for sender
      console.log('this guy dont have team')
      const availableRoles = allRoles.filter(
        (r) => r.members.size === 0 && r.name.startsWith('Team'),
      )
      teamRole =
        availableRoles[Math.floor(Math.random() * availableRoles.length)]
    } else {
      if (allowedParticipants.length === 0) {
        return send('You already have team.')
      }
      teamRole = guildMember.roles.cache.find((r) => r.name.startsWith('Team'))
    }

    // no avaiable team left
    if (!teamRole) {
      return send('No team left')
    }

    // add role to all
    for (const user of [...allowedParticipants, guildMember]) {
      await user.roles.add(teamRole)
    }

    // re-fetch
    guild.roles
      .fetch(teamRole.id)
      .then((role) => {
        console.log(role.members)
        return send(
          `${teamRole} now has: ${[...role.members.values()].join(', ')}`,
        )
      })
      .catch(console.error)
  },
}
