const Embed = require('../../lib/Embed')

module.exports = {
	name: 'verify',
	description: 'verify your account with Eventpop reference code',
	slash: {
		registerData: {
			data: {
				name: 'verify',
				description: 'verify your account with Eventpop reference code',
			},
		},
	},
	async execute({ send, member }) {
		send(`Sent instructions in your DM, ${member}`)
		member.createDM().then((channel) => {
			channel.send(
				Embed.Embed(
					'Verify',
					'enter Eventpop reference code ``#XXXXX-XXXXXXX`` in THIS channel',
				),
			)
		})
	},
}
