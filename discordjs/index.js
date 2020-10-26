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
						)
						.addField(
							"status [nome]",
							'Exibe todos dados do galo, exemplo: "!r status Poderoso"'
						);
					msg.reply(embed);
					break;

				case "criar":
					if (commands[2] && commands[2] != "") {
						require("./create")(msg, commands[2]);
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
								require("./training")(msg, commands[2], type);
							}
						}
					}
					break;

				case "status":
					if (commands[2] && commands[2] != "") {
						require("./status")(msg, commands[2]);
					}
					break;
				default:
					msg.reply("Oi?");
					break;
			}
		}
	});

	client.login(config.discordtoken);
};
