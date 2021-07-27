const firebase = require('firebase')
const { guildId } = require('../../config.json')
const Embed = require('./Embed')

module.exports = Authenticate

async function Authenticate(client, refCode, message) {
	if (!client.database) {
		return message.channel.send('Database unavaiable')
	}

	const docId = 'g86J49lbnaDIYxEnn0Om'

	const attendeeCollection = client.database
		.collection('refcode')
		.doc(docId)
		.collection('attendees')
	const participantCollection = client.database
		.collection('refcode')
		.doc(docId)
		.collection('participants')

	const attendeeDocRef = attendeeCollection.doc(refCode)
	const attendeeDocSnapshot = await attendeeDocRef.get()
	const participantDocRef = participantCollection.doc(refCode)
	const participantSnapshot = await participantDocRef.get()

	if (attendeeDocSnapshot.exists) {
		const { used } = attendeeDocSnapshot.data()

		if (used) {
			return message.channel.send(
				Embed.SendError(
					'Error',
					'This code is already used. Please contact the staff',
				),
			)
		}

		try {
			await attendeeDocRef.set({
				used: true,
				used_by: message.author.id,
				used_at: firebase.firestore.FieldValue.serverTimestamp(),
			})

			const guild = await client.guilds.fetch(guildId)
			const attendeeRole = guild.roles.cache.find((e) => e.name === 'Attendee')

			const guildMember = guild.members.cache.find(
				(e) => e.id === message.author.id,
			)

			await guildMember.roles.add(attendeeRole)

			await message.channel.send(
				Embed.SendSuccess('Attendee Role Granted', 'Enjoy the Hackathon!'),
			)
		} catch (e) {
			console.error(e)
			message.channel.send(Embed.SendError('Error', 'Please contact the staff.'))
		}
	}

	else if (participantSnapshot.exists) {
		const { used } = participantSnapshot.data()

		if (used) {
			return message.channel.send(
				Embed.SendError(
					'Error',
					'This code is already used. Please contact staff',
				),
			)
		}

		try {
			await participantDocRef.set({
				used: true,
				used_by: message.author.id,
				used_at: firebase.firestore.FieldValue.serverTimestamp(),
			})

			const guild = await client.guilds.fetch(guildId)
			const participantRole = guild.roles.cache.find(
				(e) => e.name === 'Participant',
			)
			const guildMember = guild.members.cache.find(
				(e) => e.id === message.author.id,
			)

			console.log(participantRole)

			await guildMember.roles.add(participantRole)

			await message.channel.send(
				Embed.SendSuccess('Participant Role Granted', 'Enjoy the Hackathon!'),
			)
		} catch (e) {
			console.error(e)
			message.channel.send(Embed.SendError('Error', 'Please contact staff'))
		}
	}
	
	else {
		return message.channel.send(
			Embed.SendError('Failed', 'Invalid reference code'),
		)
	}
}
