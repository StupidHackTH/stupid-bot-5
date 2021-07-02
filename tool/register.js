const Slash = require("./lib/Slash.js")
const fs = require("fs")

const { clientId, guildId } = require("../config.json")

require("dotenv").config()

const slash = new Slash(clientId, guildId, process.env.TOKEN)

// load command
const commandFolders = fs.readdirSync("./src/commands")

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"))
    for (const file of commandFiles) {
        const command = require(`../src/commands/${folder}/${file}`)

        if (command.slash) {
            slash.command(command.slash)

            console.log(`[Registered]: ${command.name}`)
        }
    }
}
