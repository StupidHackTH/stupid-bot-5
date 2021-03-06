const Embed = require('../../lib/Embed')
const { prefix } = require('../../../config.json')
const updateTeamList = require('../../lib/updateTeam');
const { Message } = require('discord.js');

module.exports = {
	name: 'add',
	description: 'add member / create team / submit with no member to create team',
	usage: 'add <@user>',
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
		const attendeeRole = allRoles.find((r) => r.name === 'Attendee')

		if (!participantRole)
			return send(
				Embed.SendError('Add to Team', "there's no participants in the db lol.")
			)

		const allParticipants = [...participantRole.members.values()]
		const mentionedParticipants = mentions.users

		// check if sender have participant role
		if (!participantRole.members.has(guildMember.id) && !attendeeRole.members.has(guildMember.id)) {
			return send(
				Embed.SendError(
					'Add to Team',
					"You don't a have participant or an attendee role. Try /verify if you have an Eventpop reference code."
				)
			)
		}
		// check if mentioned user have participant/attendee role
		const RealParticipants = mentionedParticipants.filter((m) => {
			return m.roles.cache.has(participantRole.id) || m.roles.cache.has(attendeeRole.id)
		})
		if (mentions.users.length !== RealParticipants.length) {
			return send(
				Embed.SendError(
					'Add to Team',
					"Some of the mentioned members don't have a participant or attendee role. They'll have to verify their tickets first."
				)
			)
		}

		// find team
		let teamRole = undefined
		let admin = undefined
		let color = undefined

		// sender don't have team
		if (!guildMember.roles.cache.some((e) => e.name.startsWith('Team') && !e.name.includes('Admin'))) {
			// create team for sender
			admin = guildMember.id
			color = 'fcd200'
			const availableRoles = allRoles.filter(
				(r) => r.members.size === 0 && r.name.startsWith('Team') && !r.name.includes('Admin')
			)
			teamRole =
				availableRoles[Math.floor(Math.random() * availableRoles.length)]
		} else {
			if (RealParticipants.length === 0) {
				return send(Embed.SendError('Add to Team', 'You already have a team.'))
			}
			teamRole = guildMember.roles.cache.find((r) => r.name.startsWith('Team') && !r.name.includes('Admin'))
		}

		// no avaiable team left
		if (!teamRole) {
			return send(Embed.SendError('Add to Team', 'No available team left ;('))
		}

		// check if mentioned users don't have a team
		const allowedParticipants = RealParticipants.filter((m) => {
			return !m.roles.cache.some(
				(r) => r.name.startsWith('Team') && r.name !== teamRole.name
			)
		})

		if (mentions.users.length !== allowedParticipants.length) {
			return send(
				Embed.SendError(
					'Add to Team',
					`Some of your members already have a team. Please do \`\`${prefix}leave\`\` first`
				)
			)
		}

		// alread
		const alreadyInTeam = RealParticipants.every((m) => {
			return m.roles.cache.some(
				(r) => r.name.startsWith('Team') && r.name === teamRole.name
			)
		})

		if (alreadyInTeam && mentions.users.length > 0) {
			return send(
				Embed.SendError(
					'Add to Team',
					`Every member that you're trying to add is already in this team.`
				)
			)
		}

		// add role to all
		const addRole = async () => {
			// batch add users to user database
			const batch = client.database.batch()
			for await (const user of [...allowedParticipants, guildMember]) {
				await user.roles.add(teamRole)

				const userSnapshot = await client.database
					.collection('Users')
					.doc(user.id)
					.get()

				if (!userSnapshot.exists) {
					const userRef = client.database.collection("Users").doc(user.id)
					batch.set(userRef, { name: user.user.username })
				}
			}
			await batch.commit()

			const role = await guild.roles.fetch(teamRole.id)

			await role.edit({ color: parseInt(color, 16) })

			// update / create team
			await client.database
				.collection('Teams')
				.doc(teamRole.name)
				.set(
					{
						...(admin && { name: teamRole.name }),
						members: [...role.members.values()].map((e) => e.id),
						...(admin && { admins: [admin] }), // will add owner as admin if team was just created
						...(admin && { color: color }), // will add color if team was just created
					},
					{ merge: true }
				)
				.then(() => {
					console.log('Added team to database')
				})
				.catch((err) => {
					console.error('Error writing to database', err)
				})

			return
		}

		try {
			await addRole()

			updateTeamList(guild, client)

			// get teamColor
			const teamColor = await client.database
				.collection('Teams')
				.doc(teamRole.name)
				.get()
				.then((snapshot) => {
					if (snapshot.exists) return snapshot.data().color
					else return null
				})
				.catch((err) => {
					console.error('Error requesting to database', err)
				})

			// set member's nickname if there isn't one yet
			
			const role = await guild.roles.fetch(teamRole.id)
			
			return send(
				Embed.Embed(
					'Add to Team',
					`${teamRole} now has: ${[...role.members.values()].join(', ')}`,
					teamColor || '#fcd200'
				)
			)
		} catch (e) {
			updateTeamList(guild, client)

			console.error(e)
		}
	},
}