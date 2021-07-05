// file system module to perform file operations
const Discord = require("discord.js")
const fs = require("fs")

module.exports = {
    name: "createteam",
    description: "Create your team",
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

        // use set for optimization
        var OccupiedRole = new Set()

        for (const [key, value] of guild.members.cache) {
            value._roles.forEach((RoleId) => {
                OccupiedRole.add(RoleId)
            })
        }

        // get available team
        const allRoles = (await guild.roles.fetch()).cache

        var availableTeam = []

        for (const [key, role] of allRoles) {
            // role.member doesnt work dont know why
            if (role.name.startsWith("team") && !OccupiedRole.has(role.id)) {
                availableTeam.push(role)
            }
        }

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
                await guild.channels.create("Voice chat", {
                    type: "voice",
                    parent: newCategory,
                })
                await guild.channels.create("text", {
                    type: "text",
                    parent: newCategory,
                })
            })
    },
}
