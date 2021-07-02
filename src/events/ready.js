module.exports = {
    name: "ready",
    execute(client) {
        console.log(`[Ready]: login as ${client.user.tag}`)
    },
}
