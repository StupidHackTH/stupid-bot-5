const Slash = require("./lib/Slash.js")
const fs = require("fs")

const { clientId, guildId } = require("../config.json")

require("dotenv").config()

const slash = new Slash(clientId, guildId, process.env.TOKEN)

slash.getCommands().then((commands) => {
    commands.forEach((command) => {
        slash.deleteCommand({ id: command.id })

        console.log(`[Unregistered]: ${command.name}`)
    })
})
