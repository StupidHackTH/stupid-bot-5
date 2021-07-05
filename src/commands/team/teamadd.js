module.exports = {
    name: "teamadd",
    description: "add member to team",
    usage: "teamadd [user]",
    aliases: ["addteam"],
    slash: {
        registerData: {
            guildOnly: true,
            data: {
                name: "teamadd",
                description: "add member to your team",
                options: [
                    {
                        name: "user",
                        description: "user to add",
                        type: 6,
                        required: true,
                    },
                ],
            },
        },
    },
    async execute({ send, client, args, member_id, guild_id }) {
        // get guild
        const guild = await client.guilds.fetch(guild_id)

        // args from prefix command will be <@!{id}> but from interaction will {id}
        const invited_id = member_id.startsWith("<")
            ? args[0].slice(3, args[0].length - 1)
            : args[0]

        const member = guild.members.cache.get(member_id)
        const invited = guild.members.cache.get(invited_id)

        console.log({ member_id, guild_id, invited_id, member, guild, invited })

        // check if invited user already have team
        for (const [key, role] of invited.roles.cache) {
            if (role.name.startsWith("team")) {
                return send(`<@${invited.id}> already have team`)
            }
        }

        for (const [key, role] of member.roles.cache) {
            // find team of invitor
            if (role.name.startsWith("team")) {
                const team = role
                invited.roles.add(team)
                return send(`<@${invited.id}> was added to <@&${team.id}>`)
            }
        }
        return send(`you don't have a team,<@${member.id}>.`)
    },
}
