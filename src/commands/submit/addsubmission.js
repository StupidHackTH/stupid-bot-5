const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'addsubmission',
	description: 'Add submission',
	args: 1,
	hide: true,
	usage: '[name] [video link]',
	async execute({ send, member, client, args }) {
		if (args.length < 2) {
			return send(
				Embed.SendError(
					'Failed',
					`found ${args.length} argument, expect at least 2 arguments`
				)
			)
		}

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

		const submissionLink = args.splice(args.length - 1, 1)
		const submissionName = args.join(' ')

		// append submited video
		if (!submissions) {
			submissions = [{ name: submissionName, link: submissionLink }]
		} else {
			submissions.push({ name: submissionName, link: submissionLink })
		}

		// update database
		await teamDocumentRef.update({ submissions })
		// response

		send(Embed.SendSuccess('Success', 'Added submission'))
	},
}
