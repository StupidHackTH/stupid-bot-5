module.exports = {
	name: 'pong',
	description: 'ping.',
	slash: {
	  registerData: {
		guildOnly: true,
		data: {
		  name: 'pong',
		  description: 'ping',
		},
	  },
	},
	execute({ send }) {
	  send('ping')
	},
  }
  