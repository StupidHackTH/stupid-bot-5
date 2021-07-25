const firebase = require('firebase')
const { guildId } = require('../../config.json')
const Embed = require('../../lib/Embed')

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
          'This code is already used. Please contact staff',
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
      const participantRole = guild.roles.cache.find(
        (e) => e.name === 'Attendee',
      )
      const guildMember = guild.members.cache.find(
        (e) => e.id === message.author.id,
      )

      await guildMember.roles.add(participantRole)

      await message.channel.send(
        Embed.SendSuccess('Attendee Role Granted', 'Enjoy Hackathon!'),
      )
    } catch (e) {
      console.error(e)
      message.channel.send(Embed.SendError('Error', 'Please contact staff'))
    }
  }

  if (participantSnapshot.exists) {
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
      await docRef.set({
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

      await guildMember.roles.add(participantRole)

      await message.channel.send(
        Embed.SendSuccess('Participant Role Granted', 'Enjoy Hackathon!'),
      )
    } catch (e) {
      console.error(e)
      message.channel.send(Embed.SendError('Error', 'Please contact staff'))
    }
  }

  return send(Embed.SendError('Failed', 'Invalid reference code'))
}
