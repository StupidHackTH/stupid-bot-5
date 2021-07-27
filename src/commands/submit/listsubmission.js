const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'listsubmission',
	description: 'list submissions',
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
			return send(Embed.SendError('Failed', "You don't have team"))
		}

		// get submission from firestore
		const teamDocumentRef = client.database
			.collection('Teams')
			.doc(teamRole.name)
		const teamDocumentSnapshot = await teamDocumentRef.get()

		const { submissions } = teamDocumentSnapshot.data()

		const submissionFields = submissions?.map((submission, index) => {
			return { name: `${index}: ${submission.name}`, value: submission.link }
		})

		// format data as embed
		const embed = Embed.Embed(
			'Submission',
			'Here is your list of submission',
			'#7f03fc',
			submissionFields
		)

		// respond
		send(embed)

		// little easter egg
		if (!submissionFields) {
			setTimeout(() => send("oh, look like you haven't submit any"), 2000)
			setTimeout(() => send('no hurry, you have time ( or do you? )'), 5000)
		}
	},
}
