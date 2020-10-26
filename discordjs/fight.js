const Discordjs = require("discord.js");
const Rooster = require("../models/Rooster");

module.exports = async (message, name, opponentId) => {
	const userId = message.author.id;

	try {
		const rooster = await Rooster.findOne({
			discordId: userId,
			name: name,
		});

		const opponentRoosters = await Rooster.find({
			discordId: opponentId,
		});

		const guild = message.channel.guild;

		let channelFight = await guild.channels.create(`fight-${rooster.name}`, {
			type: "text",
			parent: "770394354337710091",
			permissionOverwrites: [
				{
					allow: [
						"VIEW_CHANNEL",
						"READ_MESSAGE_HISTORY",
						"EMBED_LINKS",
						"ATTACH_FILES",
						"SEND_MESSAGES",
					],
					id: message.author.id,
				},
				{
					allow: "VIEW_CHANNEL",
					id: guild.id,
				},
			],
			reason: `Luta`,
		});

		channelFight.send(`<@${opponentId}> Escolha seu Galo: `);
		opponentRoosters.map((opponentRooster, index) => {
			channelFight.send(`${index + 1}: ${opponentRooster.name}`);
		});

		const collector = new Discordjs.MessageCollector(
			channelFight,
			(m) => m.author.id === opponentId,
			{ time: 1000 * 60 * 5 }
		);
		collector.on("collect", (message) => {
			const roosterId = Number(message.content) - 1;
			if (opponentRoosters[roosterId]) {
				console.log("oponente setado");
				const opponent = opponentRoosters[roosterId];
				console.log("oponente setado", opponent);

				channelFight.setName(`fight-${rooster.name}-${opponent.name}`);
				console.log("channel name alterado");

				channelFight.send(`<@${userId}> e <@${opponentId}>: preparem-se!`);
				channelFight.send(`envie 'a' para atarcar e 'd' para defender`);

				fight(
					{ id: userId, rooster: rooster },
					{ id: opponentId, rooster: opponent }
				);
				collector.stop();
			}
		});

		const fight = async (opponent1, opponent2) => {
			console.log("fight function");
			const collector1 = new Discordjs.MessageCollector(
				channelFight,
				(m) => m.author.id === opponent1.id,
				{ time: 1000 * 60 * 10 }
			);
			const collector2 = new Discordjs.MessageCollector(
				channelFight,
				(m) => m.author.id === opponent2.id,
				{ time: 1000 * 60 * 10 }
			);

			collector1.on("collect", (message) => {
				if (message.content == "a") {
					opponent2.rooster.constitution += -opponent1.rooster.strength;
				} else if (message.content == "d") {
					opponent1.rooster.constitution +=
						opponent1.rooster.constitution * 0.1;
				}

				if (opponent2.rooster.constitution <= 0) {
					collector2.stop();
					collector1.stop();
					channelFight.send(`<$${opponent1.id}> Venceu!`);
				}
			});
			collector2.on("collect", (message) => {
				if (message.content == "a") {
					opponent1.rooster.constitution += -opponent2.rooster.strength;
				}
				if (message.content == "d") {
					opponent2.rooster.constitution +=
						opponent2.rooster.constitution * 0.1;
				}

				if (opponent1.rooster.constitution <= 0) {
					collector1.stop();
					collector2.stop();
					channelFight.send(`<$${opponent2.id}> Venceu!`);
				}
			});
		};
	} catch (ex) {
		message.reply("Aconteceu um erro ao lutar!");
		console.log("try error fight: ", ex);
	}
};
