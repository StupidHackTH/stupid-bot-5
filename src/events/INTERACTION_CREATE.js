const InteractionManager = require('../lib/InteractionManager.js')
const Executor = require('../lib/Executor.js')

module.exports = {
  name: 'INTERACTION_CREATE',
  type: 'ws',
  async execute(interaction, _, client) {
    const IM = await InteractionManager(interaction, client)

    const commandName = interaction.data.name

    try {
      await Executor(commandName, {
        type: 1,
        send: IM.reply,
        client,
        guildMember: IM.guildMember,
        guild: IM.guild,
        args: IM.args,
        mentions: IM.mentions,
        channel: IM.channel,
        member: IM.guildMember.user,
        interaction,
      })
    } catch (e) {
      console.error(e)
    }
  },
}
