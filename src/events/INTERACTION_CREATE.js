const Discord = require("discord.js")
const fs = require("fs")
const InteractionManager = require("../lib/InteractionManager.js")

module.exports = {
    name: "INTERACTION_CREATE",
    type: "ws",
    async: true,
    execute: async (interaction, _, client) => {
        const IM = InteractionManager(interaction, client)

        const commandName = interaction.data.name

        console.log(interaction)

        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            )

        // check if command exist
        if (!command) return

        //check argument
        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, <@${interaction.member.user.id}>!`

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
            }

            return IM.reply(reply)
        }

        // check cooldown
        const { cooldowns } = client

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }

        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = (command.cooldown || 3) * 1000
        const UserId = interaction.member.user.id

        if (timestamps.has()) {
            const expirationTime = timestamps.get(UserId) + cooldownAmount

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                reply = `please wait ${timeLeft.toFixed(
                    1
                )} more second(s) before reusing the \`${
                    command.name
                }\` command.`

                IM.reply(reply)
            }
        }

        timestamps.set(UserId, now)
        setTimeout(() => timestamps.delete(UserId), cooldownAmount)

        try {
            command.slash.execute(interaction, client, IM)
        } catch (error) {
            console.error(error)
            IM.reply("Error")
        }
    },
}
