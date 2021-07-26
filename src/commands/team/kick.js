const Embed = require('../../lib/Embed')
const { prefix } = require('../../../config.json')
const updateTeamList = require('../../lib/updateTeam')

module.exports = {
	name: 'remove',
	description: 'remove member from team',
	usage: 'remove [user]',
	aliases: ['teamremove', 'kick'],
	guildOnly: true,
	slash: {
		registerData: {
			guildOnly: true,
			data: {
				name: 'remove',
				description: 'remove members from the team',
				options: [
					{
						name: 'member_1',
						description: 'Member to remove',
						type: 6,
						required: false,
					},
					{
						name: 'member_2',
						description: 'Member to remove',
						type: 6,
						required: false,
					},
					{
						name: 'member_3',
						description: 'Member to remove',
						type: 6,
						required: false,
					},
					{
						name: 'member_4',
						description: 'Member to remove',
						type: 6,
						required: false,
					},
				],
			},
		},
	},
	async execute({ client, send, guild, guildMember, mentions }) {
		if (mentions.users.length === 0)
			return send(
				Embed.SendError('Remove from Team', 'Please mention at least one user.')
			)

		const allRoles = [...guild.roles.cache.values()]
		const participantRole = allRoles.find((r) => r.name === 'Participant')

		if (!participantRole)
			return send(
				Embed.SendError('Remove from Team', "idk there's no participants lol.")
			)

		const mentionedParticipants = mentions.users

		// check if sender have participant role
		if (!participantRole.members.has(guildMember.id)) {
			return send(
				Embed.SendError(
					'Remove from Team',
					"You don't a have participant role. Try /verify if you have an Eventpop reference code."
				)
			)
		}
		// check if mentioned user have participant role
		const RealParticipants = mentionedParticipants.filter((m) => {
			return m.roles.cache.has(participantRole.id)
		})

		if (mentions.users.length !== RealParticipants.length) {
			return send(
				Embed.SendError(
					'Remove from Team',
					"Some of the mentioned members don't have a participant role. They'll have to verify their tickets first."
				)
			)
		}

		// find team
		let teamRole = undefined

		// sender doesn't have team
		const senderRole = guildMember.roles.cache
		if (!senderRole.some((e) => e.name.startsWith('Team'))) {
			return send(Embed.SendError('Remove from Team', "You don't have a team"))
		} else {
			teamRole = senderRole.find((r) => r.name.startsWith('Team'))
		}

		if (!teamRole)
			return send(Embed.SendError('Remove from Team', 'Something went wrong.'))

		// check if mentioned users are in this team
		const allowedParticipants = RealParticipants.filter((m) => {
			return m.roles.cache.some(
				(r) => r.name === teamRole.name // user role matches team role
			)
		})

		if (allowedParticipants.length !== RealParticipants.length) {
			return send(
				Embed.SendError(
					'Remove from Team',
					`Some of the mentioned members aren't in this team.`
				)
			)
		}

		const oldData = await client.database
			.collection('Teams')
			.doc(teamRole.name)
			.get()
			.then((snapshot) => {
				if (snapshot.exists) return snapshot.data()
				else return null
			})
			.catch((err) => console.error('Error fetching from database', err))

		if (!oldData)
			return Embed.SendError(
				'Remove from Team',
				"Can't find info about your team."
			)

		if (!oldData.admins.includes(guildMember.id)) {
			return send(
				Embed.SendError('Remove from Team', "You aren't authorized to do this.")
			)
		}

		// remove role to all
		const removeRole = async () => {
			const allRoles = [...guild.roles.cache.values()]
			const AdminRole = allRoles.find((r) => r.name.includes(`${teamRole.name} Admin`))

			for await (const user of allowedParticipants) {
				await user.roles.remove(teamRole)
				await guildMember.roles.remove(AdminRole)
			}


			const membersToRemove = allowedParticipants.map((user) => user.id)

			await client.database
				.collection('Teams')
				.doc(teamRole.name)
				.update({
					members: oldData.members.filter(
						(member) => !membersToRemove.includes(member)
					),
					admins: oldData.admins.filter(
						(admin) => !membersToRemove.includes(admin)
					),
				})
				.then(() => {
					console.log('Removed team from database')
				})
				.catch((err) => {
					console.error('Error writing to database', err)
				})
		}

		try {
			await removeRole()

			updateTeamList(guild, client)

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

			const role = await guild.roles.fetch(teamRole.id)
			return send(
				Embed.Embed(
					'Remove from Team',
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
