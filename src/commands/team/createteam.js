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
    async execute({ type, client, send, interaction = {}, message = {} }) {
        // get guild and member
        const guildId = type === 1 ? interaction.guild_id : message.guild.id
        console.log(guildId)
        const guild = await client.guilds.fetch(guildId)

        const memberId =
            type === 1 ? interaction.member.user.id : message.author.id
        const member = guild.members.cache.get(memberId)

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

        console.log(availableTeam)

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
    },
}
