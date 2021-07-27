const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'choosemainsubmission',
	description: 'choose main submission by index',
	hide: true,
	args: 1,
	usage: '[index]',
	async execute({ send, member, client, args }) {
		// use member in case of submit on Direct message
		const guild = await client.guilds.fetch(guildId)
		const guildMember = guild.members.cache.get(member.id)

		// get team role
		const teamRole = guildMember.roles.cache.find((role) =>
			role.name.match(/^Team[\d]{2}$/)
		)

		if (!teamRole) {
			return send(Embed.SendError('Failed', "You don't have team"))
		}

		// get submission from firestore
		const teamDocumentRef = client.database
			.collection('Teams')
			.doc(teamRole.name)
		const teamDocumentSnapshot = await teamDocumentRef.get()

		const { submissions } = teamDocumentSnapshot.data()

		// check if it exist
		if (!submissions) {
			return send(Embed.SendError('Failed', 'No submission found'))
		}

		// check out of bound
		if (args[0] < 0 || args[0] >= submissions.length) {
			return send(Embed.SendError('Failed', 'Index out of bound na kub'))
		}

		// change index to the 0 position
		submissions.unshift(submissions.splice(args[0], 1)[0])

		// update
		await teamDocumentRef.update({ submissions })

		// respond
		send(Embed.SendSuccess('Success', 'update submission'))
	},
}
