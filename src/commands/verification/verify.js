const Embed = require('../../lib/Embed')

module.exports = {
	name: 'verify',
	description: 'verify your account with an Eventpop reference code',
	slash: {
		registerData: {
			data: {
				name: 'verify',
				description: 'verify your account with an Eventpop reference code',
			},
		},
	},
	async execute({ send, member }) {
		send(`Sent instructions in your DM, ${member}`)
		member.createDM().then((channel) => {
			channel.send(
				Embed.Embed(
					'Verify',
					'Enter your Eventpop order number (``#XXXXX-XXXXXXX``) in THIS channel',
				),
			)
		})
	},
}
