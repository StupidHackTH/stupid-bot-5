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
			r.name.startsWith('Team')
		)
		if (!teamRole) {
			return send(
				Embed.SendError('Leave Team', `You don't have a team, ${guildMember}.`)
			)
		}

		const role = await guild.roles.fetch(teamRole.id)
		const memberCount = [...role.members.values()].length

		await guildMember.roles.remove(teamRole)

		const TeamCollection = client.database.collection('Teams')

		if (memberCount <= 1) {
			await TeamCollection.doc(teamRole.name)
				.delete()
				.then(() => {
					send(Embed.SendSuccess('Leave', `Left ${teamRole.name} successfully`))
				})
				.catch((err) => {
					console.error(err)
					send(
						Embed.SendError(
							'Leave',
							`There was an error while trying to leave the team`
						)
					)
				})
			role.edit({ color: [252, 210, 0] })
		} else {
			await TeamCollection.doc(teamRole.name)
				.update({
					members: [...role.members.values()]
						.map((e) => e.id)
						.filter((id) => id !== guildMember.user.id),
				})
				.then(() => {
					console.log('Removed user from team database')
				})
				.catch((err) => {
					console.error('Error wrting to database', err)
				})
		}

		updateTeamList(guild, client)
	},
}
