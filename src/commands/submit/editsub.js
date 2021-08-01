const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'editsub',
	description: 'edit submission by index',
	aliases: ['editsubmission'],
	hide: true,
	args: 3,
	usage: '[index] [type] [value]',
	async execute({ send, member, client, args }) {
		// use member in case of submit on Direct message
		const guild = await client.guilds.fetch(guildId)
		const guildMember = guild.members.cache.get(member.id)

		// get team role
		const teamRole = guildMember.roles.cache.find((role) =>
			role.name.match(/^Team[\d]{2}$/)
		)

		if (!teamRole) return send(Embed.SendError('Failed', "You don't have a team"))

		const types = ["name", "link", "description"]
		const editType = args[1].toLowerCase()

		if (!types.includes(editType)) return send(Embed.SendError('Failed', "Invalid type: You can only edit types [name, link, description]"))

		if (editType === "link") {
			const ytRegx = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
			if (!ytRegx.test(args[2])) return send(Embed.SendError('Edit Submission', "The link provided has to be a youtube link"))
		}

		// get submission from firestore
		const teamDocumentRef = client.database
			.collection('Teams')
			.doc(teamRole.name)
		const teamDocumentSnapshot = await teamDocumentRef.get()

		let { submissions, color } = teamDocumentSnapshot.data()
		
		// check if it exists
		if (!submissions) {
			return send(Embed.SendError('Edit Submission', 'No submission found'))
		}

		const editIndex = args[0]
		
		// check out of bound
		if (editIndex < 0 || editIndex >= submissions.length) {
			return send(Embed.SendError('Edit Submission', "Index out of bound na kub (aka submission not found)"))
		}

		const editValue = args.slice(2).join(" ")

		// replace element value with the new one
		submissions[editIndex][editType] = editValue

		// update
		await teamDocumentRef.update({ submissions })

		const submissionFields = submissions?.map((submission, index) => {
			return { name: `⠀\n${index}: ${submission.name}`, value: `*Description:*\n${submission.description}\n⠀\n*Link:*\n${submission.link}` }
		})

		if (submissionFields.length !== 0) submissionFields[0].name = "⠀\n> main submission" + submissionFields[0].name

		// respond
		send(Embed.Embed('Edit Submission', 'Edited the submission', `#${color}`, submissionFields))
	},
}
