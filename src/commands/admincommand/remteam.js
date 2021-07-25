const { SendSuccess, SendError } = require('../../lib/Embed')
const updateTeamList = require('../../lib/updateTeam')

module.exports = {
	name: 'remteam',
	description: 'reset all team',
	usage: "remteamrole [<'all'>[team]]",
	adminOnly: true,
	guildOnly: true,
	async execute({ client, send, guild, args, message }) {
		if (args.length === 0) {
			return send(SendError('Remove', 'remteam regex/ [team] [team] ...'))
		}

		if (message.mentions.roles.size > 0) {
			const batch = client.database.batch()

			message.mentions.roles.forEach(async (r) => {
				const roleRef = client.database.collection('Teams').doc(r.name)
				batch.delete(roleRef)
				r.delete('The command was invoked')
			})

			batch
				.commit()
				.then(() => {
					console.log('Removed Teams from database')
				})
				.catch((err) => {
					console.error('Error wrting to database', err)
				})

			send(SendSuccess('Remove', 'Removed mentioned team'))
		} else {
			const batch = client.database.batch()

			const reg = new RegExp(args[0])
			let count = 0
			;[...guild.roles.cache.values()]
				.filter((r) => reg.test(r.name))
				.forEach(async (r) => {
					const roleRef = client.database.collection('Teams').doc(r.name)
					batch.delete(roleRef)
					r.delete('The command was invoked')
					count += 1
				})

			batch
				.commit()
				.then(() => {
					console.log('Removed Teams from database')
				})
				.catch((err) => {
					console.error('Error wrting to database', err)
				})

			send(SendSuccess('Remove', `Removed ${count} team`))
		}

		updateTeamList(guild, client)
	},
}
