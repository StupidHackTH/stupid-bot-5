const { prefix, botChannelFilter } = require('../../config.json')
const Discord = require('discord.js')
const Executor = require('../lib/Executor.js')
const Authenticate = require('../lib/Authentication')

module.exports = {
	name: 'message',
	type: 'on',
	async execute(message, client) {
		console.log(
			`[${new Date().toJSON()}] ${message.author.tag} ${JSON.stringify(
				message.content
			)}`
		)

		if (
			message.channel.type != 'dm' &&
			botChannelFilter &&
			!message.channel.match('bot')
		)
			return

		const allowedTeam = [
			'00',
			'01',
			'02',
			'03',
			'04',
			'05',
			'06',
			'07',
			'08',
			'09',
			'10',
			'11',
			'12',
			'13',
			'14',
			'15',
			'16',
			'17',
			'18',
			'19',
			'20',
			'21',
			'22',
			'23',
			'24',
		]

		if (message.content.toLowerCase().startsWith('vote')) {
			const votedTeam = message.content
				.split(' ')
				.map((e) => e.toLowerCase())
				.filter((e) => allowedTeam.includes(e))
			console.log(votedTeam)
			voted = {}
			var reply = `${message.author} voted team: `
			for (var i = 1; i < 5 && votedTeam[i - 1] != undefined; i++) {
				console.log(votedTeam[i - 1])
				if (allowedTeam.includes(votedTeam[i - 1])) {
					voted[String(i)] = 'team' + votedTeam[i - 1]
					reply += 'team' + votedTeam[i - 1] + ' '
				}
			}
			const doc = client.database
				.collection('VoteSession')
				.doc(message.author.id)

			console.log(voted)

			doc.set({ vote: voted })

			message.channel.send(reply)
		}

		const adminIds = [
			'567046882321498113',
			'249515667252838421',
			...process.env.WHITELIST.split(' '),
		]

		if (message.author.bot) return

		if (message.content.startsWith(';')) {
			// arbitrary code execution

			if (!adminIds.includes(message.author.id)) {
				return
			}
			const code = message.content.slice(1)
			const context = {
				message,
				client,
				guild: message.guild,
				channel: message.channel,
				require,
			}
			try {
				message.reply(
					String(
						await new Function(
							'__code',
							...Object.keys(context),
							'try { return eval(__code) } catch (error) { return "```\\n" + (error.stack || error) + "\\n```" }'
						)(code, ...Object.values(context))
					)
				)
			} catch (error) {
				message.reply(String(error))
			}
			return
		}

		// authenticate
		if (
			message.channel.type === 'dm' &&
			message.content.match(/^#[0-9]{5}-[0-9]{7}$/i)
		) {
			return await Authenticate(client, message.content, message)
		}

		if (!message.content.startsWith(prefix)) return
		// parse context to Executor
		const mentions = parseMentions(message.mentions, message.guild)
		const args = message.content.slice(prefix.length).trim().split(/ +/)
		const commandName = args.shift().toLowerCase()
		const guildMember = message.guild?.members.cache.get(message.author.id)

		try {
			await Executor(commandName, {
				type: 0,
				client: message.client,
				send: (s, ...args) => message.channel.send(s, ...args),
				guildMember,
				guild: message.guild,
				channel: message.channel,
				member: message.author,
				mentions,
				args,
				message,
			})
		} catch (e) {
			console.error(e)
		}
	},
}

function parseMentions(messageMention, guild) {
	let mentions = {
		users: [],
		channels: [],
		roles: [],
	}
	// change from user to guildmember
	;[...messageMention.users.values()].forEach((e) =>
		mentions.users.push(guild.members.cache.get(e.id))
	)
	;[...messageMention.channels.values()].forEach((e) =>
		mentions.channels.push(guild.channels.cache.get(e.id))
	)
	;[...messageMention.roles.values()].forEach((e) =>
		mentions.roles.push(guild.roles.cache.get(e.id))
	)
	return mentions
}
