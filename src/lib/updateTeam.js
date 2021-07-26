module.exports = updateTeamList

const { teamChannelId } = require('../../config.json')

async function updateTeamList(oldguild, client) {
	// refetch in case user pass old guild
	const guild = await oldguild.fetch()

	const channel = guild.channels.cache.find((e) => e.id === teamChannelId)

	if (!channel) return

	const roles = [...guild.roles.cache.values()].filter((e) =>
		e.name.startsWith('Team') && !e.name.includes('Admin')
	)

	const messageList = await channel.messages.fetch({ limit: 100 })

	const messages = [...messageList.values()].filter((e) =>
		[...e.mentions.roles.values()][0]?.name.startsWith('Team')
	)

	console.log(`messages role: ${messages.length}, roles: ${roles.length}`)

	// make new one
	if (messages.length !== roles.length) {
		messages.forEach((message) => {
			message.delete()
		})

		roles.forEach((role) => {
			// TODO
			const teamName = ''
			const members = [...role.members.values()].join(', ')

			channel.send(`${role} ${teamName} — ${members}`)
		})
	}

	// update current one
	else {
		let teamName = {}

		const teamCollection = client.database.collection('Teams')
		const teamSnapshot = await teamCollection.get()

		teamSnapshot.forEach((QueryDocumentSnapshot) => {
			const { name } = QueryDocumentSnapshot.data()
			teamName[QueryDocumentSnapshot.id] = name
		})

		console.table(teamName)

		messages.forEach((message) => {
			const role = message.mentions.roles.first()
			// const teamName = teamName[role.name] || ''
			const name =
				teamName[role.name] === role.name ? '' : teamName[role.name] || ''
			const members = role.members

			const newMessage = `${role} ${name} — ${[...members.values()].join(', ')}`

			if (message.content.trim() != newMessage.trim()) {
				message.edit(newMessage)
			}
		})
	}
}
