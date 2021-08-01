const { ToColorCode, ToColorString } = require('../../lib/Color')
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
  async execute({ guildMember, send, args, client, guild }) {
    const role = guildMember.roles.cache.find((e) => e.name.startsWith('Team'))

    if (!role) return send(Embed.SendError("Color", "You don't a have team yet."))

    try {
      // const array = ToArray(args[0])
      // if (args[0].split("").every((c) => /^[#]{0,1}[0-9A-F]{6}$/i.test(c))) throw new Error("HexCode was not formatted correctly.")
      const [colorString, colorInt] = [ToColorString(args[0]), ToColorCode(args[0])]
      
      await client.database
        .collection('Teams')
        .doc(role.name)
        .set({
          color: colorString
        }, { merge: true })
        .then(() => { 
          console.log("set team color")
        })
        .catch((err) => {
          console.error("Error wrting to database", err)
        })


      // const allRoles = [...guild.roles.cache.values()]
      // const AdminRole = allRoles.find((r) => r.name.includes(`${role.name} Admin`))
  
      // if (AdminRole) await AdminRole.edit({ colorInt })
      
      console.log(role, colorInt)

      await role.edit({ color: colorInt })

      send(Embed.Embed("🎨 Color", `A new color was set for ${role.name}: #${colorString}`, colorString))
    } catch (e) {
      console.error(e)
      if (e.message = "HexCode was not formatted correctly.") return send(Embed.SendError("Color", "The color code was not formatted correctly <#abcdef or abcdef>"))
      else return send(Embed.SendError("Color", "There was an error"))
    }
  },
}