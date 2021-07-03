module.exports = InterationManager

function InterationManager(interaction, client) {
    const reply = (message) => {
        client.api
            .interactions(interaction.id, interaction.token)
            .callback.post({
                data: {
                    type: 4,
                    data: {
                        content: message,
                    },
                },
            })
    }

    return { reply }
}
