const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'listsub',
	description: 'list submissions',
	aliases: ['listsubmission'],
	hide: true,
	async execute({ send, member, client }) {
		// use member in case of submit on Direct message
		const guild = await client.guilds.fetch(guildId)
		const guildMember = guild.members.cache.get(member.id)

		// get team role
		const teamRole = guildMember.roles.cache.find((role) =>
			role.name.match(/^Team[\d]{2}$/)
		)

		if (!teamRole) {
			return send(Embed.SendError('List Submissions', "You don't have a team"))
		}

		// get submission from firestore
		const teamDocumentRef = client.database
			.collection('Teams')
			.doc(teamRole.name)
		const teamDocumentSnapshot = await teamDocumentRef.get()

		const { submissions } = teamDocumentSnapshot.data()

		const submissionFields = submissions?.map((submission, index) => {
			return { name: `\n${index}: ${submission.name}`, value: `Description: ${submission.description}\nLink: ${submission.link}` }
		})

		// format data as embed
		const embed = Embed.Embed(
			'List Submissions',
			'Here is the list of your submissions',
			'#7f03fc',
			submissionFields
		)

		// respond
		send(embed)

		// little easter egg
		if (!submissionFields) {
			setTimeout(() => send("oh, looks like you haven't submit anything"), 2000)
			setTimeout(() => send('no hurry, you have time ( o r d o y o u ? )'), 5000)
		}
	},
}
