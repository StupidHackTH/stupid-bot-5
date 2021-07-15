const fs = require("fs")

module.exports = {
    name: "reload",
    description: "Reloads a command",
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "reload",
                description: "reload command",
                options: [
                    {
                        name: "command",
                        description: "command name to reload",
                        type: 3,
                        required: true,
                    },
                ],
            },
        },
    },
    execute({ client, args, send }) {
        const commandName = args[0].toLowerCase()
        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            )

        if (!command) {
            return send(
                `There is no command with name or alias \`${commandName}\`, ${message.author}!`
            )
        }

        const commandFolders = fs.readdirSync("./src/commands")
        const folderName = commandFolders.find((folder) =>
            fs
                .readdirSync(`./src/commands/${folder}`)
                .includes(`${command.name}.js`)
        )

        delete require.cache[
            require.resolve(`../${folderName}/${command.name}.js`)
        ]

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`)
            client.commands.set(newCommand.name, newCommand)
            send(`Command \`${newCommand.name}\` was reloaded!`)
        } catch (error) {
            console.error(error)
            send(
                `There was an error while reloading a command: \`${command.name}\`:\n\`${error.message}\``
            )
        }
    },
}
