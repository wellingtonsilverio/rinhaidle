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

		console.log("message", message);
		message.send(`debbug 1`);

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

		message.send(`debbug 2`);
		opponentRoosters.map((opponentRooster, index) => {
			channelFight.send(`${index + 1}: ${opponentRooster.name}`);
		});

		const collector = new Discordjs.MessageCollector(
			channelFight,
			(m) => m.author.id === opponentId,
			{ time: 1000 * 60 * 5 }
		);
		collector.on("collect", (message) => {
			message.send(`debbug 3`);
			const roosterId = Number(message.content) - 1;
			if (opponentRoosters[roosterId]) {
				const opponent = opponentRoosters[roosterId];

				channelFight.setName(`fight-${rooster.name}-${opponent.name}`);

				channelFight.send(`<@${userId}> e <@${opponentId}>: preparem-se!`);
				channelFight.send(`envie 'a' para atarcar e 'd' para defender`);

				fight(
					{ id: userId, rooster: rooster },
					{ id: opponentId, rooster: opponent },
					message
				);
				collector.stop();
			}
		});

		const fight = async (opponent1, opponent2, message) => {
			message.send(`debbug 4`);
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

			collector1.on("collect", (_message) => {
				if (_message.content == "a") {
					opponent2.rooster.constitution += -opponent1.rooster.strength;
					channelFight.send(
						`${opponent2.rooster.name} está com ${opponent2.rooster.constitution} de vida`
					);
				} else if (_message.content == "d") {
					const gain = opponent1.rooster.constitution * 0.1;
					opponent1.rooster.constitution += gain;
					channelFight.send(`${opponent1.rooster.name} ganhou ${gain} de vida`);
				}

				if (opponent2.rooster.constitution <= 0) {
					collector2.stop();
					collector1.stop();
					require("./addCoins")(opponent1.id);
					message.send(`<@${opponent1.id}> Venceu!`);
					channelFight.delete();
				}
			});
			collector2.on("collect", (_message) => {
				if (_message.content == "a") {
					opponent1.rooster.constitution += -opponent2.rooster.strength;
					channelFight.send(
						`${opponent1.rooster.name} está com ${opponent1.rooster.constitution} de vida`
					);
				}
				if (_message.content == "d") {
					const gain = opponent2.rooster.constitution * 0.1;
					opponent2.rooster.constitution += gain;
					channelFight.send(`${opponent2.rooster.name} ganhou ${gain} de vida`);
				}

				if (opponent1.rooster.constitution <= 0) {
					collector1.stop();
					collector2.stop();
					require("./addCoins")(opponent2.id);
					message.send(`<@${opponent2.id}> Venceu!`);
					channelFight.delete();
				}
			});
		};
	} catch (ex) {
		message.reply("Aconteceu um erro ao lutar!");
		console.log("try error fight: ", ex);
	}
};
