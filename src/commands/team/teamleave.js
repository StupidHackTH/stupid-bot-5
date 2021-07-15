module.exports = {
    name: "teamleave",
    description: "leave your team",
    usage: "teamleave",
    aliases: ["leave", "leaveteam"],
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "leave",
                description: "removes user from a team",
            },
        },
    },
    async execute({ send, client, member_id, guild_id }) {
        // get guild
        const guild = await client.guilds.fetch(guild_id)

        const member = guild.members.cache.get(member_id)

        // check if invited user already have team
        for (const [key, role] of member.roles.cache) {
            if (role.name.startsWith("team")) {
                // remove role
                member.roles.remove(role)

                // delete channel and category if last member leave
                if (role.members.size === 1) {
                    // find category
                    for (const [key, channel] of guild.channels.cache) {
                        if (
                            channel.type === "category" &&
                            channel.name.startsWith(role.name)
                        ) {
                            const category = channel
                            for (const [childkey, child] of category.children) {
                                await child.delete()
                            }
                            await category.delete()
                        }
                    }

                    return send(
                        `<@${member.id}> has left <@&${role.id}>.` +
                            `\n<@&${role.id}> is now empty.`
                    )
                } else {
                    return send(`<@${member.id}> has left <@&${role.id}>.`)
                }
            }
        }

        return send(`You don't have a team, <@${member.id}>.`)
    },
}
