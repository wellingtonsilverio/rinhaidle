"use strict";

const discordjs = require("discord.js");

const client = new discordjs.Client();

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

				default:
					msg.reply("Oi?");
					break;
			}
		}
	});

	async function createRooster(message, name) {
		const userId = message.authorID;

		try {
			const rooster = await RoosterService.createRooster({
				discordId: userId,
				name: name,
			});

			message.reply("Galo " + name + " criado com sucesso!");
		} catch (ex) {
			message.reply(
				"Aconteceu um erro ao criar o Galo, pode ser que o nome já é utilizado!"
			);
		}
	}

	client.login(config.discordtoken);
};
