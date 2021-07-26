const Embed = require('../../lib/Embed')
const updateTeamList = require('../../lib/updateTeam')

module.exports = {
	name: 'teamname',
	description: "change your team's name",
	usage: 'name',
	aliases: ['changename', 'name'],
	args: 1,
	guildOnly: true,
	slash: {
		registerData: {
			guildOnly: true,
			data: {
				name: 'teamname',
				description: "change your team's name",
				options: [
					{
						name: 'name',
						description: "the teams's new name",
						type: 3,
						required: true,
					},
				],
			},
		},
	},
	async execute({ guildMember, send, args, client, guild }) {
		const role = guildMember.roles.cache.find((e) => e.name.startsWith('Team'))

		if (!role)
			return send(Embed.SendError('Color', "You don't a have team yet."))

		const newName = [...args].join(" ")

		try {
			await client.database
				.collection('Teams')
				.doc(role.name)
				.update({
					name: newName,
				})
				.then(() => {
					console.log(
						`Changed ${role.name}'s name to ${newName} in the database`
					)
				})
				.catch((err) => {
					console.error('Error wrting to database', err)
				})

			const teamColor = await client.database
				.collection('Teams')
				.doc(role.name)
				.get()
				.then((snapshot) => {
					if (snapshot.exists) return snapshot.data().color
					else return null
				})
				.catch((err) => {
					console.error('Error requesting to database', err)
				})

			updateTeamList(guild, client)

			return send(
				Embed.Embed(
					'Change name',
					`${role}'s new name is: ${newName}`,
					teamColor || '#fcd200'
				)
			)
		} catch (e) {
			console.error(e)
			updateTeamList(guild, client)
			return send(Embed.SendError('Change name', 'there was an error'))
		}
	},
}
