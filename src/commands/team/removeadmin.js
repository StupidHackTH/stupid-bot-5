const Embed = require('../../lib/Embed')
const firebase = require('firebase')

module.exports = {
	name: 'deadmin',
	description: 'removes admin from assigned user',
	usage: 'name',
	aliases: ['deop'],
	guildOnly: true,
	slash: {
		registerData: {
			guildOnly: true,
			data: {
				name: 'admin',
				description: 'removes admin from assigned user',
				options: [
					{
						name: 'member_1',
						description: 'Member to remove',
						type: 6,
						required: true,
					},
					{
						name: 'member_2',
						description: 'Member to remove',
						type: 6,
						required: false,
					},
					{
						name: 'member_3',
						description: 'Member to remove',
						type: 6,
						required: false,
					},
					{
						name: 'member_4',
						description: 'Member to remove',
						type: 6,
						required: false,
					},
				],
			},
		},
	},
	async execute({ guildMember, send, args, mentions, client }) {
		const role = guildMember.roles.cache.find((e) => e.name.startsWith('Team'))

		if (!role)
			return send(Embed.SendError('Admin', "You don't a have team yet."))

		if (args.length === 0)
			return send(Embed.SendError('Admin', 'Please mention at least one user.'))

		const mentionedParticipants = mentions.users

		const inTeam = mentionedParticipants.every((m) => {
			return m.roles.cache.has(role.id)
		})

		if (!inTeam)
			return send(
				Embed.SendError(
					'Admin',
					'Every mentioned member needs to be in your team.',
				),
			)

		try {
			const admins = await client.database
				.collection('Teams')
				.doc(role.name)
				.get()
				.then((snapshot) => {
					if (snapshot.exists) {
						return snapshot.data().admins
					} else {
						return null
					}
				})

			if (!admins.includes(guildMember.id))
				return send(
					Embed.SendError('Admin', 'You are unauthorized to do this.'),
				)

			const mentionIds = mentions.users.map((user) => user.id)
			const newAdmins = admins.filter((admin) => !mentionIds.includes(admin))

			if (newAdmins.length === 0)
				return send(
					Embed.Embed(
						'Admin',
						"Everyone you're trying to add is not an admin.",
					),
				)

			await client.database
				.collection('Teams')
				.doc(role.name)
				.update({
					admins: newAdmins
				})
				.then(() => {
					console.log(`Changed ${role.name}'s admin list in the database`)
				})
				.catch((err) => {
					console.error('Error wrting to database', err)
				})

			return send(
				Embed.SendSuccess('Admin', `Changed ${role.name}'s admin list.`),
			)
		} catch (e) {
			console.error(e)
			return send(Embed.SendError('Admin', 'there was an error'))
		}
	},
}