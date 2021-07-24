const firebase = require('firebase')
const { guildId } = require('../../config.json')

module.exports = Authenticate

async function Authenticate(client, refCode, message) {
  if (!client.database) {
    return message.channel.send('Database unavaiable')
  }

  const docId = 'g86J49lbnaDIYxEnn0Om'

  const codeCollection = client.database
    .collection('refcode')
    .doc(docId)
    .collection('code')

  const docRef = codeCollection.doc(refCode)
  const docSnapshot = await docRef.get()

  if (!docSnapshot.exists) {
    return message.channel.send('Invalid reference code')
  }

  const { used } = docSnapshot.data()

  if (used) {
    return message.channel.send('This code is already used')
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

    await message.channel.send('Role Granted \nEnjoy Hackathon!')
  } catch (e) {
    console.error(e)
    message.channel.send('There was an error please contact staff')
  }
}
