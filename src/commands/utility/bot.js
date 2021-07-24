const { prefix } = require('../../../config.json')
const Embed = require('../../lib/Embed')

module.exports = {
  name: 'bot',
  slash: {
    registerData: {
      guildOnly: false,
      data: {
        name: 'bot',
        description: 'Get bot info',
      },
    },
  },
  execute({ send }) {
    send(Embed.Embed(
      "About",
      `I'm a mindless stupid bot with a \`\`${prefix} \`\` prefix (or you can use  \`\`/\`\` instead).`
    ))
  },
}
