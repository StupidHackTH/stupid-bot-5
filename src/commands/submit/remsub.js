const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'remsub',
	description: 'remove submission by index',
	aliases: ['remsubmission', 'rmsub'],
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
			return send(Embed.SendError('Failed', "You don't have a team"))
		}

		// get submission from firestore
		const teamDocumentRef = client.database
			.collection('Teams')
			.doc(teamRole.name)
		const teamDocumentSnapshot = await teamDocumentRef.get()

		let { submissions, color } = teamDocumentSnapshot.data()

		// check if it exist
		if (!submissions) {
			return send(Embed.SendError('Failed', 'No submission found'))
		}

		// check out of bound
		if (args[0] < 0 || args[0] >= submissions.length) {
			return send(Embed.SendError('Failed', "Index out of bound na kub (aka submission not found)"))
		}

		// remove element by index
		submissions.splice(args[0], 1)

		// update
		await teamDocumentRef.update({ submissions })

		const submissionFields = submissions?.map((submission, index) => {
			return { name: `⠀\n${index}: ${submission.name}`, value: `*Description:*\n${submission.description}\n⠀\n*Link:*\n${submission.link}` }
		})

		if (submissionFields.length !== 0) submissionFields[0].name = "⠀\n> main submission" + submissionFields[0].name

		// respond
		send(Embed.Embed('Success', 'Removed the submission.', `#${color}`, submissionFields))
	},
}
