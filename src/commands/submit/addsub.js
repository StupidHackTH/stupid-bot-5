const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'addsub',
	description: 'Add submission',
	aliases: ['addsubmission'],
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
			return send(Embed.SendError('Add Submission', "You don't have a team"))
		}

		// get submission from firestore
		const teamDocumentRef = client.database
			.collection('Teams')
			.doc(teamRole.name)

		const teamDocumentSnapshot = await teamDocumentRef.get()
		let { submissions, color } = teamDocumentSnapshot.data()

		const submissionLink = args[args.length-1]
		const submissionName = args.slice(0, args.length-1).join(' ')

		const ytRegx = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
		if (!ytRegx.test(submissionLink)) return send(Embed.SendError('Add Submission', "The link provided has to be a youtube link"))

		const currSubmission = {
			name: submissionName,
			link: submissionLink,
			description: ""
		};

		// append submited video
		if (!submissions) {
			submissions = [currSubmission]
		} else {
			submissions.push(currSubmission)
		}

		// update database
		await teamDocumentRef.update({ submissions })
		// response

		const submissionFields = submissions?.map((submission, index) => {
			return { name: `⠀\n${index}: ${submission.name}`, value: `*Description:*\n${submission.description}\n⠀\n*Link:*\n${submission.link}` }
		})

		if (submissionFields.length !== 0) submissionFields[0].name = "⠀\n> main submission" + submissionFields[0].name

		send(Embed.Embed('Success', 'Added the submission', `#${color}`, submissionFields))
	},
}
