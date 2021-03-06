const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'submithelp',
	description: 'get info about how to submit projects',
	slash: {
		registerData: {
			guildOnly: true,
			data: {
				name: 'submithelp',
				description: 'get info about how to submit projects',
			},
		},
	},
	async execute({ send, member }) {
		send(`Sent instructions in your DM, ${member}`)
		member.createDM().then((channel) => {
			channel.send(
				Embed.Embed(
					'Submit Command',
					'You can submit via DM to keep your submission secret from other teams\n The first submission in the list will be the main submission will be the main submission,\nNote that submission name is only there to make it easier to remember (and it will also be displayed in the stupid hackathon website)\nPlease Note that it\'s required that you have to provide a youtube link for the submission too.',
					'#000000',
					[
						{
							name: 'stp listsub',
							value: "list all of your team's submission by order.",
						},
						{
							name: 'stp addsub [submission name] [link]',
							value: 'add submission.',
						},
						{
							name: 'stp editsub [index] [name|description|link] [value]',
							value: 'edit a submission.',
						},
						{
							name: 'stp remsub [index]',
							value: 'remove submission by index.',
						},
						{
							name: 'stp choosemainsub [index]',
							value: 'choose main submission (by pushing [index] to the first)',
						},
					]
				)
			)
		})
	},
}
