const fs = require("fs")
const Discord = require("discord.js")

require("dotenv").config()

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

const http = require('http');

http.createServer((req, res) => {
  res.write('helo world')
  res.end()
})
.listen(process.env.PORT || 80)

// load command
const commandFolders = fs.readdirSync("./src/commands")

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"))
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`)
        client.commands.set(command.name, command)

        console.log(`[Loaded command]: ${command.name}`)
    }
}

// load event
const eventFiles = fs
    .readdirSync("./src/events")
    .filter((file) => file.endsWith(".js"))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (!event.async) {
        if (event.type === "once") {
            client.once(event.name, (...args) => event.execute(...args, client))
        } else if (event.type === "on") {
            client.on(event.name, (...args) => event.execute(...args, client))
        }
        console.log(`[Loaded event]: ${event.name}`)
    }
}

client.login(process.env.TOKEN)
