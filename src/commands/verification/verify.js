module.exports = {
  name: 'verify',
  description: 'verify your account with Eventpop reference code',
  slash: {
    registerData: {
      data: {
        name: 'verify',
        description: 'verify your account with Eventpop reference code',
      },
    },
  },
  async execute({ send, member }) {
    send(`Sent instruction, ${member}`)
    member.createDM().then((channel) => {
      channel.send(
        'enter Eventpop reference code ``#XXXXX-XXXXXXX`` in THIS channel',
      )
    })
  },
}
