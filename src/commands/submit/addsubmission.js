const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'addsubmission',
	description: 'Add submission',
	args: 1,
	hide: true,
	usage: '[name] [video link]',
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
		var { submissions } = teamDocumentSnapshot.data()

		// append submited video
		if (!submissions) {
			submissions = [{ name: args[0], link: args[1] }]
		} else {
			submissions.push({ name: args[0], link: args[1] })
		}

		// update database
		await teamDocumentRef.update({ submissions })
		// response

		send(Embed.SendSuccess('Success', 'Added submission'))
	},
}
