const { ToColorCode, ToColorString } = require('../../lib/Color')
const Embed = require('../../lib/Embed')

module.exports = {
	name: 'nickname',
	description: 'set a nickname (will be displayed in the stupid hackathon website)',
	usage: 'nickname foo bar',
	args: 1,
	aliases: ['nick', 'name'],
	guildOnly: true,
	slash: {
		registerData: {
			guildOnly: true,
			data: {
				name: 'nickname',
				description:
					'set a nickname (will be displayed in the stupid hackathon website)',
				options: [
					{
						name: 'name',
						description: 'name to change to',
						type: 3,
						required: true,
					},
				],
			},
		},
	},
	async execute({ guildMember, send, args, client, guild }) {
		const allRoles = [...guild.roles.cache.values()]
		const role = guildMember.roles.cache.find((e) => e.name.startsWith('Team'))
		const participantRole = allRoles.find((r) => r.name === 'Participant')
		const attendeeRole = allRoles.find((r) => r.name === 'Attendee')

		if (!role) return send(Embed.SendError('Nickname', "You don't a have team yet."))

		// check if sender have participant role
		if (!participantRole.members.has(guildMember.id) && !attendeeRole.members.has(guildMember.id)) {
			return send(Embed.SendError(
				'Nickname',
				"You don't a have participant or an attendee role. Try /verify if you have an Eventpop reference code."
			))
		}

		await client.database
			.collection("Users")
			.doc(guildMember.id)
			.set({
				name: args.join(" ")
			}, { merge: true })
			.then(() => {
				send(Embed.SendSuccess("Nickname", `Saved your username: ${args.join(" ")} in the database (Your name will be shown on the web!).`))
			})
			.catch((e) => {
				console.error(e)
				send(Embed.SendError("Nickname", "There was a problem while setting your nickname"))
			})
	}
}
