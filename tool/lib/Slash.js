class Slash {
    constructor(clientId, guildId, token) {
        this.axios = require("axios")
        this.clientId = clientId
        this.token = token
        this.guildId = guildId
    }

    command(options) {
        let url = `https://discord.com/api/v8/applications/${this.clientId}/commands`

        if (!options.data)
            throw new Error("[ERROR]: Data for command wasn't provided")
        if (options.guildOnly === true && !this.guildId)
            throw new Error(
                "[ERROR] Command was guild only, but no guild ID provided"
            )
        if (options.guildOnly === true)
            url = `https://discord.com/api/v8/applications/${this.clientId}/guilds/${this.guildId}/commands`
        if (!options.data.name)
            throw new Error("[ERROR] Command name wasn't provided")
        if (!options.data.embeds) options.data.embeds = []

        let cmd = {
            name: options.data.name,
            description: options.data.description || "No description provided",
            options: options.data.options || [],
        }

        let config = {
            method: "POST",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify(cmd),
            url,
        }

        this.axios(config)
            .then((response) => {})
            .catch((err) => {
                console.log(`[ERROR] Request failed\n${err}`)
            })

        return this
    }
    getCommands(options = {}) {
        return new Promise((resolve, reject) => {
            let url = `https://discord.com/api/v8/applications/${this.clientId}/commands`
            if (this.guildId)
                url = `https://discord.com/api/v8/applications/${this.clientId}/guilds/${this.guildId}/commands`
            this.axios
                .get(url, {
                    headers: {
                        Authorization: "Bot " + this.token,
                    },
                })
                .then((res) => resolve(res.data))
                .catch((e) => reject(e))
        })
    }
    deleteCommand(options) {
        if (!options.id) throw new Error("[ERROR]: No Command ID was provided!")
        var url = `https://discord.com/api/v8/applications/${this.clientId}/${
            this.guildId ? "guilds/" + this.guildId + "/" : ""
        }commands/${options.id}`
        this.axios({
            method: "delete",
            url,
            headers: {
                Authorization: "Bot " + this.token,
            },
        }).catch((err) => {
            console.log(`[ERROR] Request failed\n${err}`)
        })
        return this
    }
}

module.exports = Slash
