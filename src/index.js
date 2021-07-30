const fs = require('fs')
const Discord = require('discord.js')
const firebase = require('firebase')

require('dotenv').config()

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

const http = require('http')

http
  .createServer((req, res) => {
    res.write('helo world')
    res.end()
  })
  .listen(process.env.PORT || 80)

var firebaseConfig = {
  apiKey: 'AIzaSyAXOlKvl4dCdfNPs7-ESbwLA7918tHgG1k',
  authDomain: 'stupid-reference-code.firebaseapp.com',
  projectId: 'stupid-reference-code',
  storageBucket: 'stupid-reference-code.appspot.com',
  messagingSenderId: '749205312711',
  appId: '1:749205312711:web:300b7bdd185a002e1a9ae2',
  measurementId: 'G-5NCC8DLM1L',
}

// firebase setup
firebase.initializeApp(firebaseConfig)
firebase
  .auth()
  .signInWithEmailAndPassword(
    ...process.env.AUDIENCE_APP_CREDENTIALS.split(':'),
  )
  .then(async () => {
    console.log(
      'Authence app authenticated as',
      firebase.auth().currentUser.uid,
    )
    client.database = firebase.firestore()
    console.log('Link bot to database')
  })
  .catch((e) => {
    console.log("Can't connect to database")
    console.error(e)
  })

loadCommands(client)
loadEvents(client)

client.login(process.env.TOKEN)

function loadCommands(client) {
  const commandFolders = fs.readdirSync('./src/commands')

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/commands/${folder}`)
      .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`)
      client.commands.set(command.name, command)

      console.log(`[Loaded command]: ${command.name}`)
    }
  }
}

function loadEvents(client) {
  const eventFiles = fs
    .readdirSync('./src/events')
    .filter((file) => file.endsWith('.js'))

  for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.type === 'ws') {
      client.ws.on(event.name, async (...args) => {
        try {
          await event.execute(...args, client)
        } catch (e) {
          console.error(e)
        }
      })
    } else if (event.type === 'once') {
      client.once(event.name, (...args) => event.execute(...args, client))
    } else if (event.type === 'on') {
      client.on(event.name, (...args) => event.execute(...args, client))
    }
    console.log(`[Loaded event]: ${event.name}`)
  }
}
