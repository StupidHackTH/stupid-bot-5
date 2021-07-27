const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'submit',
	description: 'get command about subbmison',
	slash: {
		registerData: {
			guildOnly: true,
			data: {
				name: 'submit',
				description: 'get submission command',
			},
		},
	},
	async execute({ send, member }) {
		send(`Sent instructions in your DM, ${member}`)
		member.createDM().then((channel) => {
			channel.send(
				Embed.Embed(
					'Submit Command',
					'you can submit via DM to keep your submission secret to other team\n The 0-index will be the main submission\nnote that submission name is only to make it easier to remember',
					'#000000',
					[
						{
							name: 'stp listsubmission',
							value: "list all of your team's submission by index.",
						},
						{
							name: 'stp addsubmission [submission name] [link]',
							value: 'add submission.',
						},
						{
							name: 'stp remsubmission [index]',
							value: 'remove submission by index.',
						},
						{
							name: 'stp choosemainsubmission [index]',
							value: 'choose main submission (by pushing [index] to the first)',
						},
					]
				)
			)
		})
	},
}
