module.exports = {
  name: 'remteam',
  description: 'reset all team',
  usage: "remteamrole [<'all'>[team]]",
  adminOnly: true,
  guildOnly: true,
  async execute({ send, guild, args, message }) {
    if (args.length === 0) {
      return send('remteam regex/ [team] [team] ...')
    }
    if (message.mentions.roles.size > 0) {
      message.mentions.roles.forEach(async (r) => {
        r.delete('The command was invoked')
      })
      send('Removed mentioned team')
    } else {
      const reg = new RegExp(args[0])
      console.log(reg)
      let count = 0
      ;[...guild.roles.cache.values()]
        .filter((r) => reg.test(r.name))
        .forEach(async (r) => {
          r.delete('The command was invoked')
          count += 1
        })
      send(`Removed ${count} team`)
    }
  },
}
