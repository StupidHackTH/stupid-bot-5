const Embed = require('../../lib/Embed')
const { guildId } = require('../../../config.json')

module.exports = {
	name: 'voteurl',
	description: 'get voteurl',
	hide: true,
	async execute({ member, client }) {
		const userId = member.id

		const docRef = client.database.collection('Users').doc(userId)

		try {
			const userObj = (await docRef.get()).data()

			var url = 'https://sht-5.vercel.app/vote?id='

			if (!userObj) {
				/* if no user */
				const sessionRef = await client.database.collection('VoteSession').add({
					type: 'discord',
					vote: {},
				})
				url += sessionRef.id
				await docRef.set({ voteSessionId: sessionRef.id })
			} else if (!userObj.voteSessionId) {
				/* if have user but no session */
				const sessionRef = await client.database.collection('VoteSession').add({
					type: 'discord',
					vote: {},
				})
				url += sessionRef.id
				await docRef.set({ voteSessionId: sessionRef.id })
			} else {
				/* already have session */
				url += userObj.voteSessionId
			}

			member.createDM().then((channel) => {
				channel.send(url)
			})
		} catch (e) {
			console.error(e)
		}
	},
}
