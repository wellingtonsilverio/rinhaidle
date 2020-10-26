"use strict";

const discordjs = require("discord.js");
const dayjs = require("dayjs");

const client = new discordjs.Client();
const Rooster = require("../models/Rooster");

module.exports = (config) => {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

	client.on("message", (msg) => {
		if (msg.content.startsWith("!r")) {
			const commands = msg.content.split(" ");
			switch (commands[1]) {
				case "help" || "ajuda":
					const embed = new discordjs.MessageEmbed()
						.setTitle("Comandos")
						.setDescription(
							"Lista de comandos que podem ser executados pelo Rinha IDLE"
						)
						.setColor([255, 0, 255])
						.addField(
							"criar [nome]",
							'Cria um novo galo, exemplo: "!r criar Poderoso"'
						)
						.addField(
							"treinar [nome] forca",
							'Treina o galo para adquirir mais força, exemplo: "!r treinar Poderoso forca"'
						)
						.addField(
							"treinar [nome] defesa",
							'Treina o galo para adquirir mais resistencia, exemplo: "!r treinar Poderoso defesa"'
						);
					msg.reply(embed);
					break;

				case "criar":
					if (commands[2] && commands[2] != "") {
						createRooster(msg, commands[2]);
					}
					break;

				case "treinar":
					if (commands[2] && commands[2] != "") {
						if (commands[3] && commands[3] != "") {
							const type =
								commands[3] === "forca" || commands[3] === "f"
									? 1
									: commands[3] === "defesa" || commands[3] === "d"
									? 2
									: 0;
							if (type !== 0) {
								training(msg, commands[2], type);
							}
						}
					}
					break;

				default:
					msg.reply("Oi?");
					break;
			}
		}
	});

	async function createRooster(message, name) {
		const userId = message.author.id;

		try {
			await Rooster.create({
				discordId: userId,
				name: name,
			});

			message.reply("Galo " + name + " criado com sucesso!");
		} catch (ex) {
			message.reply(
				"Aconteceu um erro ao criar o Galo, pode ser que o nome já é utilizado!"
			);
			console.log("try error createRooster: ", ex);
		}
	}

	async function training(message, name, type) {
		const userId = message.author.id;

		const trainingName = { 1: "strength", 2: "constitution" };
		const incQuery = {};
		incQuery[trainingName[type]] = type === 1 ? 10 : 100;

		try {
			const rooster = await Rooster.findOne({ discordId: userId, name: name });

			console.log("training init ", rooster.training.init);
			console.log(
				"dayjs().isAfter(dayjs(rooster.training.init))",
				dayjs().isAfter(dayjs(rooster.training.init))
			);
			console.log(
				"dayjs().isBefore(dayjs(rooster.training.init))",
				dayjs().isBefore(dayjs(rooster.training.init))
			);

			if (rooster.training && rooster.training.init) {
				if (dayjs().isBefore(dayjs(rooster.training.init))) {
					message.reply(
						"Galo " +
							name +
							" já está treinando, espere até " +
							rooster.training.init
					);
					return;
				}
			}

			const finalDate = dayjs().set("minute", type === 1 ? 20 : 30);
			await Rooster.updateOne(
				{
					discordId: userId,
					name: name,
				},
				{
					$set: {
						training: {
							type,
							init: finalDate,
						},
					},
					$inc: incQuery,
				}
			);

			message.reply(
				"Galo " +
					name +
					" comecou a treinar, o treino termina as " +
					finalDate.format("HH:mm")
			);
		} catch (ex) {
			message.reply(
				"Aconteceu um erro ao treinar o Galo, pode ser que o nome esteja errado ou você não é dono desse galo!"
			);
			console.log("try error createRooster: ", ex);
		}
	}

	client.login(config.discordtoken);
};
