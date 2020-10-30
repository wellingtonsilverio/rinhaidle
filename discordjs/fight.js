const Discordjs = require("discord.js");
const Rooster = require("../models/Rooster");

module.exports = async (message, name, opponentId) => {
	const channel = message.channel;
	const userId = message.author.id;

	try {
		const stamina = await require("./get-stamina")(userId, name);

		if (stamina < 10) {
			channel.send(
				`<@${userId}>, Seu Galo está cansado, espere um pouco para lutar com outro galo`
			);
			return;
		}
	} catch (error) {
		channel.send(`<@${userId}>, Erro ao verificar a stamina do Galo`);
		return;
	}

	try {
		const rooster = await Rooster.findOne({
			discordId: userId,
			name: name,
		}).lean();

		const opponentRoosters = await Rooster.find({
			discordId: opponentId,
		}).lean();

		const guild = message.channel.guild;

		let channelCategory = guild.channels.cache.find(
			(channel) => channel.name === "LUTAS" && channel.type === "category"
		);

		if (!channelCategory) {
			try {
				channelCategory = await guild.channels.create("LUTAS", {
					type: "category",
					permissionOverwrites: [
						{
							allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
							id: message.author.id,
						},
						{
							allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
							id: opponentId,
						},
						{
							allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
							id: guild.id,
						},
					],
				});
			} catch (error) {
				channel.send(
					`Não tenho permissão para criar Categorias e Salas de texto, por favor atualize-me!`
				);

				return;
			}
		}

		let channelFight = await guild.channels.create(`fight-${rooster.name}`, {
			type: "text",
			parent: channelCategory.id,
			// rateLimitPerUser: 1,
			permissionOverwrites: [
				{
					allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
					id: message.author.id,
				},
				{
					allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
					id: opponentId,
				},
				{
					allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
					id: guild.id,
				},
			],
		});

		channelFight.send(`<@${opponentId}> Escolha seu Galo: `);

		opponentRoosters.map((opponentRooster, index) => {
			channelFight.send(`${index + 1}: ${opponentRooster.name}`);
		});

		const collectMessage = async (channel, userId) => {
			return new Promise((resolve) => {
				const collector = new Discordjs.MessageCollector(
					channel,
					(m) => m.author.id === userId,
					{ time: 1000 * 60 * 1 }
				);
				collector.on("collect", (message) => {
					resolve(message);
					collector.stop();
					return;
				});
			});
		};

		const { content: roosterOponentId } = await collectMessage(
			channelFight,
			opponentId
		);

		const roosterId = Number(roosterOponentId) - 1;
		if (opponentRoosters[roosterId]) {
			const opponent = opponentRoosters[roosterId];

			try {
				require("./get-stamina")(opponent.discordId, opponent.name).then(
					(staminaOpponent) => {
						if (staminaOpponent < 10) {
							channelFight.send(
								`<@${opponentId}>, Este Galo está casando, tente outro!`
							);
						} else {
							channelFight.setName(`fight-${rooster.name}-${opponent.name}`);

							channelFight.send(
								`<@${userId}> e <@${opponentId}>: preparem-se!`
							);
							channelFight.send(`envie 'a' para atacar e 'd' para defender\n`);

							fight(
								{ id: userId, rooster: rooster },
								{ id: opponentId, rooster: opponent }
							);
							collector.stop();
						}
					}
				);
			} catch (error) {
				channel.send(`<@${userId}>, Erro ao verificar a stamina do Galo`);
				return;
			}
		}

		const fight = async (opponent1, opponent2) => {
			require("./wastingEnergy")(opponent1.id, opponent1.rooster.name, 10);
			require("./wastingEnergy")(opponent2.id, opponent2.rooster.name, 10);

			while (true) {
				channelFight.send(`<@${opponent1.id}> é seu turno:`);
				const messageOponent1 = await collectMessage(
					channelFight,
					opponent1.id
				);

				if (messageOponent1.content == "a") {
					opponent2.rooster.constitution += -opponent1.rooster.strength;
					channelFight.send(
						`${opponent2.rooster.name} está com ${opponent2.rooster.constitution} de vida`
					);
				} else if (messageOponent1.content == "d") {
					const gain = opponent1.rooster.constitution * 0.01;
					opponent1.rooster.constitution += gain;
					channelFight.send(`${opponent1.rooster.name} ganhou ${gain} de vida`);
				}

				if (opponent2.rooster.constitution <= 0) {
					require("./addCoins")(opponent1.id);
					channel.send(`<@${opponent1.id}> Venceu!`);
					channelFight.delete();
					return;
				}

				channelFight.send(`<@${opponent2.id}> é seu turno:`);
				const messageOponent2 = await collectMessage(
					channelFight,
					opponent2.id
				);

				if (messageOponent2.content == "a") {
					opponent1.rooster.constitution += -opponent2.rooster.strength;
					channelFight.send(
						`${opponent1.rooster.name} está com ${opponent1.rooster.constitution} de vida`
					);
				}
				if (messageOponent2.content == "d") {
					const gain = opponent2.rooster.constitution * 0.01;
					opponent2.rooster.constitution += gain;
					channelFight.send(`${opponent2.rooster.name} ganhou ${gain} de vida`);
				}

				if (opponent1.rooster.constitution <= 0) {
					require("./addCoins")(opponent2.id);
					channel.send(`<@${opponent2.id}> Venceu!`);
					channelFight.delete();
					return;
				}
			}
		};
	} catch (ex) {
		channel.send(`<@${userId}> Aconteceu um erro ao lutar!`);
		console.log("try error fight: ", ex);
	}
};
