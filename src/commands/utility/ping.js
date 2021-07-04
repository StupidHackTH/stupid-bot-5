module.exports = {
    name: "ping",
    description: "Information about the arguments provided.",
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "ping",
                description: "test bot response",
            },
        },
    },
    execute({ send }) {
        send("Im working bro")
    },
}
