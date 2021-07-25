const Embed = require('../../lib/Embed')
const { prefix } = require('../../../config.json')
const updateTeamList = require('../../lib/updateTeam')

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
  async execute({ client, send, guild, guildMember, mentions }) {
    const allRoles = [...guild.roles.cache.values()]
    const participantRole = allRoles.find((r) => r.name === 'Participant')

    if (!participantRole) return send(Embed.SendError('Add to Team', "idk there's no participants lol.",))
   
    const allParticipants = [...participantRole.members.values()]
    const mentionedParticipants = mentions.users

    // check if sender have participant role
    if (!participantRole.members.has(guildMember.id)) {
      return send(
        Embed.SendError(
          'Add to Team',
          "You don't a have participant role. Try /verify if you have an Eventpop reference code.",
        ),
      )
    }
    // check if mentioned user have participant role
    const RealParticipants = mentionedParticipants.filter((m) => {
      return m.roles.cache.has(participantRole.id)
    })
    if (mentions.users.length !== RealParticipants.length) {
      return send(
        Embed.SendError(
          'Add to Team',
          "Some of the mentioned members don't have a participant role. They'll have to verify their tickets first.",
        ),
      )
    }

    // find team
    let teamRole = undefined
    let admin = undefined
    let color = undefined

    // sender don't have team
    if (!guildMember.roles.cache.some((e) => e.name.startsWith('Team'))) {
      // create team for sender
      admin = guildMember.id
      color = "fcd200"
      const availableRoles = allRoles.filter(
        (r) => r.members.size === 0 && r.name.startsWith('Team'),
      )
      teamRole =
        availableRoles[Math.floor(Math.random() * availableRoles.length)]
    } else {
      if (RealParticipants.length === 0) {
        return send(Embed.SendError('Add to Team', 'You already have a team.'))
      }
      teamRole = guildMember.roles.cache.find((r) => r.name.startsWith('Team'))
    }

    // no avaiable team left
    if (!teamRole) {
      return send(Embed.SendError('Add to Team', 'No available team left ;('))
    }

    // check if mentioned users don't have a team
    const allowedParticipants = RealParticipants.filter((m) => {
      return !m.roles.cache.some(
        (r) => r.name.startsWith('Team') && r.name !== teamRole.name,
      )
    })

    if (mentions.users.length !== allowedParticipants.length) {
      return send(
        Embed.SendError(
          'Add to Team',
          `Some of your members already have a team. Please do \`\`${prefix}leave\`\` first`,
        ),
      )
    }

    // idk?
    const alreadyInTeam = RealParticipants.every((m) => {
      return m.roles.cache.some((r) => r.name.startsWith('Team') && r.name === teamRole.name)
    })

    if (alreadyInTeam && mentions.users.length > 0) {
      return send(
        Embed.SendError(
          'Add to Team',
          `Every member that you're trying to add is already in this team.`,
        ),
      )
    }

    // add role to all
    const addRole = async () => {
      for await (const user of [...allowedParticipants, guildMember]) {
        await user.roles.add(teamRole)
      }
      
      const role = await guild.roles.fetch(teamRole.id)

      await role.edit({ color: parseInt(color, 16) })

      await client.database
        .collection('Teams')
        .doc(teamRole.name)
        .set({
          name: teamRole.name,
          members: [...role.members.values()].map((e) => e.id),
          ...(admin && { admins: [admin] }), // will add owner as admin if team was just created
          ...(color && { color: color }),
        }, { merge: true })
        .then(() => { 
          console.log("Added team to database")
        })
        .catch((err) => {
          console.error("Error writing to database", err)
        })

      return
    }

    try {
      await addRole()

      updateTeamList(guild)

      const teamColor = await client.database
        .collection('Teams')
        .doc(teamRole.name)
        .get()
        .then((snapshot) => {
					if (snapshot.exists) return snapshot.data().color
					else return null
				})
        .catch((err) => {
          console.error("Error requesting to database", err)
        })

      const role = await guild.roles.fetch(teamRole.id)
      return send(Embed.Embed('Add to Team', `${teamRole} now has: ${[...role.members.values()].join(', ')}`, teamColor || "#fcd200"))
    } catch (e) {
      updateTeamList(guild)

      console.error(e)
    }
  },
}
