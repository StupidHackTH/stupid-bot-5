const { prefix } = require('../../../config.json')

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
    send(
      `I'm a mindless stupid bot with a \`\`${prefix} \`\` prefix (or you can use  \`\`/\`\` instead).`,
    )
  },
}
