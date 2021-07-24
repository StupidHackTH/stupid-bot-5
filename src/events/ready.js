const fs = require('fs')

module.exports = {
  name: 'ready',
  type: 'once',
  execute(client) {
    console.log(`[Ready]: login as ${client.user.tag}`)
  },
}
