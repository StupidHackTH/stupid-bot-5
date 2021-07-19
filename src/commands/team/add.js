module.exports = {
  name: 'add',
  description: 'add member to team',
  usage: 'add [user]',
  aliases: ['addteam', 'teamadd'],
  guildOnly: true,
  slash: {
    registerData: {
      guildOnly: true,
      data: {
        name: 'add',
        description:
          'add member / create team / submit with no member to create team',
        options: [
          {
            name: 'member_1',
            description: 'Member to add',
            type: 6,
            required: false,
          },
          {
            name: 'member_2',
            description: 'Member to add',
            type: 6,
            required: false,
          },
          {
            name: 'member_3',
            description: 'Member to add',
            type: 6,
            required: false,
          },
          {
            name: 'member_4',
            description: 'Member to add',
            type: 6,
            required: false,
          },
        ],
      },
    },
  },
  async execute({ send, guild, guildMember, mentions }) {
    const allRoles = [...guild.roles.cache.values()]
    const participantRole = allRoles.find((r) => r.name == 'Participant')
    const allParticipants = [...participantRole.members.values()]
    const mentionedParticipants = mentions.users

    // check if sender have participant role
    if (!participantRole.members.has(guildMember.id)) {
      return send("You don't have participant role.")
    }

    // check if mentioned user have participant role
    const RealParticipants = mentionedParticipants.filter((m) => {
      return m.roles.cache.has(participantRole.id)
    })

    if (mentions.users.length !== RealParticipants.length) {
      return send("Some of your member doesn't have participant role.")
    }

    // check if mentioned user don't have team
    const allowedParticipants = RealParticipants.filter((m) => {
      return !m.roles.cache.some((r) => r.name.startsWith('Team'))
    })

    if (mentions.users.length !== allowedParticipants.length) {
      return send(
        'Some of your member already have team. Please do `stp leave` first',
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
    const addRole = async () => {
      for await (const user of [...allowedParticipants, guildMember]) {
        await user.roles.add(teamRole)
      }
      return
    }

    try {
      await addRole()

      const role = await guild.roles.fetch(teamRole.id)
      console.log(role.members)
      return send(
        `${teamRole} now has: ${[...role.members.values()].join(', ')}`,
      )
    } catch (e) {
      console.error(e)
    }
  },
}
