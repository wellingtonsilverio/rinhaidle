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
				collector.on("collect", (_message) => {
					collector.stop();
					return resolve(_message);
				});
				collector.on("end", (collected) => {
					if (!collected || collected === {}) {
						channel.send(
							`<@${userId}>, Sala de luta fechada por tempo de inatividade!`
						);
						channelFight.delete();
						collector.stop();
						return resolve({});
					}
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
							channelFight.send(`envie 'a' para atacar e 'd' para defender`);

							fight(
								{ id: userId, rooster: rooster },
								{ id: opponentId, rooster: opponent }
							);
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

			let i = Math.random() > 0.5 ? 1 : 2;
			const oponents = [opponent1, opponent2];
			while (i !== 0) {
				channelFight.send(`<@${oponents[(i + 1) % 2].id}> é seu turno:`);
				const messageOponent1 = await collectMessage(
					channelFight,
					oponents[(i + 1) % 2].id
				);

				if (messageOponent1.content == "a") {
					const critical = Math.random();
					if (critical > 0.7) {
						oponents[i % 2].rooster.constitution += -(
							oponents[(i + 1) % 2].rooster.strength * 2
						);
						channelFight.send(
							`**DANO CRÍTICO**\n${oponents[i % 2].rooster.name} está com ${
								oponents[i % 2].rooster.constitution
							} de vida`
						);
					} else {
						oponents[i % 2].rooster.constitution += -oponents[(i + 1) % 2]
							.rooster.strength;
						channelFight.send(
							`${oponents[i % 2].rooster.name} está com ${
								oponents[i % 2].rooster.constitution
							} de vida`
						);
					}
				} else if (messageOponent1.content == "d") {
					const gain =
						oponents[(i + 1) % 2].rooster.constitution * (Math.random() * 0.1);
					oponents[(i + 1) % 2].rooster.constitution += gain;
					channelFight.send(
						`${oponents[(i + 1) % 2].rooster.name} ganhou ${gain} de vida`
					);
				}

				if (oponents[i % 2].rooster.constitution <= 0) {
					require("./addCoins")(oponents[(i + 1) % 2].id);
					channel.send(`<@${oponents[(i + 1) % 2].id}> Venceu!`);
					channelFight.delete();
					return;
				}

				i++;
			}
		};
	} catch (ex) {
		channel.send(`<@${userId}> Aconteceu um erro ao lutar!`);
		console.log("try error fight: ", ex);
	}
};
