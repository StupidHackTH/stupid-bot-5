const Embed = require('../../lib/Embed')

module.exports = {
  name: 'createteamrole',
  description: 'create team role',
  usage: 'createteamrole [team no]',
  adminOnly: true,
  guildOnly: true,
  async execute({ send, guild, args }) {
    for (let i = 0; i < args[0]; i++) {
      guild.roles.create({
        data: { name: 'Team' + String(i).padStart(2, 0) },
        reason: 'Command was invoked',
      })
    }
    send(Embed.SendSuccess("Create Team", `Created ${args[0]} Team`))
  },
}
