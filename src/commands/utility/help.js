module.exports = {
  name: 'help',
  slash: {
    registerData: {
      guildOnly: true,
      data: {
        name: 'help',
        description: 'Get bot info',
      },
    },
  },
  execute({ send }) {
    send(
      "stp add - create team if you don't have one\n" +
        "stp add [user1] [user2] ... - create team with mentioned user if you don't have team\n / add member if you already have team",
    )
  },
}
