module.exports = {
    name: "bot",
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "bot",
                description: "Get bot info",
                type: 4,
            },
        },
        execute(interaction, client, IM) {
            IM.reply(
                "I'm a mindless stupid bot with ``stupid `` prefix. or just use ``/`` command"
            )
        },
    },
    execute(message) {
        message.channel.send(
            "I'm a mindless stupid bot with ``stupid `` prefix."
        )
    },
}
