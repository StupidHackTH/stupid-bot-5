const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'choosemainsub',
	description: 'choose main submission by index',
	hide: true,
	aliases: ['choosemainsubmission', 'choosesub'],
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
			return send(Embed.SendError('Choose Submission', "You don't have a team"))
		}

		// get submission from firestore
		const teamDocumentRef = client.database
			.collection('Teams')
			.doc(teamRole.name)
		const teamDocumentSnapshot = await teamDocumentRef.get()

		const { submissions, color } = teamDocumentSnapshot.data()

		// check if it exist
		if (!submissions) {
			return send(Embed.SendError('Choose Submission', 'No submission found'))
		}

		// check out of bound
		if (args[0] < 0 || args[0] >= submissions.length) {
			return send(Embed.SendError('Choose Submission', 'Index out of bound na kub (aka submission not found)'))
		}

		// change index to the 0 position
		submissions.unshift(submissions.splice(args[0], 1)[0])

		// update
		await teamDocumentRef.update({ submissions })

		const submissionFields = submissions?.map((submission, index) => {
			return { name: `⠀\n${index}: ${submission.name}`, value: `*Description:*\n${submission.description}\n⠀\n*Link:*\n${submission.link}` }
		})

		if (submissionFields.length !== 0) submissionFields[0].name = "⠀\n> main submission" + submissionFields[0].name

		// format data as embed
		const embed = Embed.Embed(
			'Edit Submissions',
			'Here is the new list of your submissions',
			`#${color}`,
			submissionFields
		)

		// respond
		send(embed)
	},
}
