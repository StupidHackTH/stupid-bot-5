module.exports = {
    name: "bot",
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "bot",
                description: "Get bot info",
            },
        },
    },
    execute({ send }) {
        send(
            "I'm a mindless stupid bot with ``stupid `` prefix or you can you  ``/`` command"
        )
    },
}
