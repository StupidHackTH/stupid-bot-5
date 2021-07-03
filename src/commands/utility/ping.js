module.exports = {
    name: "ping",
    description: "Information about the arguments provided.",
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "ping",
                description: "test bot response",
                type: 4,
            },
        },
        execute(interaction, client, IM) {
            IM.reply("Im working bro")
        },
    },
    execute(message, args) {
        message.channel.send("Im working bro")
    },
}
