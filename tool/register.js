const Slash = require('./lib/Slash.js')
const fs = require('fs')

const { clientId, guildId } = require('../config.json')

require('dotenv').config()

const slash = new Slash(clientId, guildId, process.env.TOKEN)

// load command
const commandFolders = fs.readdirSync('./src/commands')

if (process.argv.length <= 2) {
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/commands/${folder}`)
      .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = require(`../src/commands/${folder}/${file}`)

      if (command.slash) {
        slash.command(command.slash.registerData)

        console.log(`[Registered]: ${command.name}`)
      }
    }
  }
} else {
  // deep copy
  var reloadCommand = JSON.parse(JSON.stringify(process.argv))

  // shift to third args
  reloadCommand.shift()
  reloadCommand.shift()

  reloadCommand = reloadCommand.map((e) => e + '.js')

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/commands/${folder}`)
      .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
      if (reloadCommand.includes(file)) {
        const command = require(`../src/commands/${folder}/${file}`)

        if (command.slash) {
          slash.command(command.slash.registerData)

          console.log(`[Registered]: ${command.name}`)
        }
      }
    }
  }
}
