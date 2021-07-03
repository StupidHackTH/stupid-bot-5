const fs = require("fs")

module.exports = {
    name: "ready",
    type: "once",
    execute(client) {
        // load async event
        const eventFiles = fs
            .readdirSync("./src/events")
            .filter((file) => file.endsWith(".js"))

        for (const file of eventFiles) {
            const event = require(`./${file}`)
            if (event.async) {
                if (event.type === "ws") {
                    client.ws.on(event.name, async (...args) => {
                        await event.execute(...args, client)
                    })
                }
                console.log(`[Loaded event]: ${event.name}`)
            }
        }

        console.log(`[Ready]: login as ${client.user.tag}`)
    },
}
