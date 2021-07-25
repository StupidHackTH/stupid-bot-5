const Embed = require('../../lib/Embed')

module.exports = {
  name: 'color',
  description: 'set color of your team',
  usage: '#XXXXXX',
  args: 1,
  guildOnly: true,
  slash: {
    registerData: {
      guildOnly: true,
      data: {
        name: 'color',
        description: 'set color of your team',
        options: [
          {
            name: 'hexcode',
            description: 'hexcode to change to',
            type: 3,
            required: true,
          },
        ],
      },
    },
  },
  async execute({ guildMember, send, args }) {
    const role = guildMember.roles.cache.find((e) => e.name.startsWith('Team'))

    if (!role) return send(Embed.SendError("Color", "You don't a have team yet."))

    try {
      // const array = ToArray(args[0])
      const color = ToColorCode(args[0])

      await role.edit({ color })

      send(Embed.Embed("Color", `A new color was set for ${role.name}: #${color.toString(16)}`, color.toString(16)))
    } catch (e) {
      console.error(e)
      return send(Embed.SendError("Color", "The color code was not formatted correctly <#abcdef or abcdef> or there was an error"))
    }
  },
}

const ToColorCode = (s) => {
  const colorString = s.split("").filter((e) => e !== "#").join("")

  if (colorString.length !== 6) {
    throw new Error('HexCode was not formatted correctly.')
  }

  return parseInt(colorString, 16)
}

// const ToArray = (s) => {
//   if (s == undefined) {
//     throw new Error('Hexcode is required')
//   }
//   let k = 0
//   if (s.startsWith('#')) {
//     if (s.length != 7) {
//       throw new Error('Hexcode was not format correctly')
//     }
//     k = parseInt(s.slice(1), 16)
//   } else {
//     if (s.length != 6) {
//       throw new Error('Hexcode was not format correctly')
//     }
//     k = parseInt(s, 16)
//   }
// 
//   let array = []
//   for (let i = 0; i < 3; i++) {
//     array.push(~~(k % 256))
//     k /= 256
//   }
//   return array.reverse()
// }
// 