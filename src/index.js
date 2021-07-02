const fs = require("fs")
const Discord = require("discord.js")

require("dotenv").config()

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

// load command
const commandFolders = fs.readdirSync("./src/commands")

for (const folder of commandFolders) {
    route = path.resolve(process.cwd(), route)
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
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }

    console.log(`[Loaded event]: ${event.name}`)
}

client.login(process.env.TOKEN)