const Embed = require('../../lib/Embed')

module.exports = {
	name: 'teaminfo',
	description: "get information about your team.",
	usage: 'teaminfo',
	aliases: ['info'],
	guildOnly: true,
	slash: {
		registerData: {
			guildOnly: true,
			data: {
				name: 'info',
				description: "get information about your team."
			},
		},
	},
	async execute({ guildMember, send, client }) {
		const role = guildMember.roles.cache.find((e) => e.name.startsWith('Team'))

		if (!role)
			return send(Embed.SendError('Info', "You don't a have team yet."))

		try {
			const teamInfo = await client.database
				.collection('Teams')
				.doc(role.name)
				.get()
				.then((snapshot) => {
					if (snapshot.exists) return snapshot.data()
					else return null
				})
				.catch((err) => {
					console.error('Error fetching database', err)
				}) 

			if (!teamInfo) return Embed.SendError('Info', "Can't find info about your team.")

			teamInfo.admins = teamInfo.admins.map((admin) => `<@${admin}>`).join(", ")
			teamInfo.members = teamInfo.members.map((member) => `<@${member}>`).join(", ")
			teamInfo.color = `#${teamInfo.color}`
			
			teamFields = Object.entries(teamInfo).map((field) => {
				const fieldName = field[0].charAt(0).toUpperCase() + field[0].slice(1)
				const value = field[1]

				return {
					name: fieldName,
            		value: value
				}
			})

			return send(
				Embed.Embed('Info', `Information about ${teamInfo.name}.`, teamInfo.color || "#fcd200", teamFields),
			)
		} catch (e) {
			console.error(e)
			return send(Embed.SendError('Info', 'there was an error'))
		}
	},
}
