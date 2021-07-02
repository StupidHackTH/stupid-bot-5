module.exports = {
    name: "bot",
    slash: {
        guildOnly: true,
        data: {
            name: "bot",
            description: "Get bot info",
            type: 4,
        },
    },
    execute(message) {
        message.channel.send(
            "I'm a mindless stupid bot with ``stupid `` prefix."
        )
    },
}
