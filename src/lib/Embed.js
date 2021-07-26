const { ToColorCode } = require("./Color")

/***
 * Returns a discord.js Embed
 * @constructor
 * @param {string} title - The title of the embed.
 * @param {string} description - The description of the embed
 * @param {stirng} color - Hex
 */
const Embed = (title, description = '', color = '#7f03fc', fields = []) => {
  return {
    embed: {
      color: ToColorCode(color),
      title,
      description,
      fields,
    },
  }
}

/***
 * Returns an error Embed
 * @constructor
 * @param {string} title - The title of the embed.
 * @param {string} description - The description of the embed
 */
const SendError = (title = '', description = '') => {
  return Embed(`😔 Error${title ? `: ${title}` : ''}`, description, '#f55742')
}

/***
 * Returns an success Embed
 * @constructor
 * @param {string} title - The title of the embed.
 * @param {string} description - The description of the embed
 */
const SendSuccess = (title = '', description = '') => {
  return Embed(`🙌 Success${title ? `: ${title}` : ''}`, description, '#4aff83')
}

module.exports = {
  Embed,
  SendError,
  SendSuccess,
}
