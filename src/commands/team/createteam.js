// file system module to perform file operations
const Discord = require("discord.js")
const fs = require("fs")

module.exports = {
    name: "createteam",
    description: "Create your team",
    usage: "createteam",
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "createteam",
                description: "assign you to empty team",
            },
        },
    },
    async execute({ client, send, member_id, guild_id }) {
        // get guild and member
        const guild = await client.guilds.fetch(guild_id)

        const member = guild.members.cache.get(member_id)

        for (const [key, role] of member.roles.cache) {
            if (role.name.startsWith("team")) {
                return send(`you already have team,<@${member.id}>.`)
            }
        }

        // get available team
        const allRoles = guild.roles.cache

        var availableTeam = []

        for (const [key, role] of allRoles) {
            if (role.name.startsWith("team") && role.members.size === 0) {
                availableTeam.push(role)
            }
        }

        // check if there exist available team
        if (availableTeam.length === 0) {
            return send(
                "no empty team left, you should find other team to join"
            )
        }
        // random 1 team
        const randomTeam =
            availableTeam[Math.floor(Math.random() * availableTeam.length)]

        // set team
        member.roles.add(randomTeam)
        send(`<@${member.id}> was assign to <@&${randomTeam.id}>`)

        // create channel
        const offset = 3
        var newCategoryPosition = offset
        for (const [key, channel] of guild.channels.cache) {
            if (
                channel.name.startsWith("team") &&
                randomTeam.name.localeCompare(channel.name) === 1 &&
                channel.type === "category"
            ) {
                console.log({ name: channel.name, newChannelPosition })
                newChannelPosition++
            }
        }

        guild.channels
            .create(randomTeam.name, {
                type: "category",
                position: newCategoryPosition,
                permissionOverwrites: [
                    {
                        id: randomTeam,
                        allow: Discord.Permissions.FLAGS.VIEW_CHANNEL,
                    },
                    {
                        id: guild.roles.everyone,
                        deny: Discord.Permissions.FLAGS.VIEW_CHANNEL,
                    },
                ],
            })
            .then(async (newCategory) => {
                guild.channels.create("Voice chat", {
                    type: "voice",
                    parent: newCategory,
                })
                guild.channels.create("text", {
                    type: "text",
                    parent: newCategory,
                })
            })
    },
}
