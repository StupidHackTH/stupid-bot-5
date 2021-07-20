// this command is named mbs because [me]mber will be auto-complete to /me command and it's annoying

module.exports = {
  name: 'mbs',
  description: 'list current member of your team',
  usage: 'mbs',
  aliases: ['members', 'teammembers'],
  guildOnly: true,
  slash: {
    registerData: {
      guildOnly: true,
      data: {
        name: 'mbs',
        description: 'list member of your team',
        options: [
          {
            name: 'roles',
            description: 'roles to check, leave empty for your team',
            type: 8,
            required: false,
          },
        ],
      },
    },
  },
  async execute({ send, guild, guildMember, mentions }) {
    const teamreg = new RegExp('Team[\\d]{2}')

    let teamRole = undefined

    console.log(mentions)

    if (mentions.roles.length > 0) {
      ;[teamRole] = mentions.roles
    } else {
      teamRole = guildMember.roles.cache.find((r) => teamreg.test(r.name))
    }

    if (!teamRole) {
      return send("You don't have a team")
    }

    if (teamRole.members.size === 0) {
      return send(`${teamRole} has no one.`)
    }

    send(
      `${teamRole} has: ${[...teamRole.members.values()]
        .map((e) => e.nickname || e.displayName)
        .join(', ')}`,
    )
  },
}
