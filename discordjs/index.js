"use strict";

const Discordjs = require("discord.js");

const client = new Discordjs.Client();

module.exports = (config) => {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

	client.on("message", (msg) => {
		if (msg.content.startsWith("!r")) {
			msg.delete();
			const commands = msg.content.split(" ");
			switch (commands[1]) {
				case "help" || "ajuda":
					const embed = new Discordjs.MessageEmbed()
						.setTitle("Comandos")
						.setDescription(
							"Lista de comandos que podem ser executados pelo Rinha IDLE"
						)
						.setColor([255, 0, 255])
						.addField(
							"criar [nome]",
							'Cria um novo galo, Exemplo: "!r criar Poderoso"'
						)
						.addField(
							"treinar [nome] forca",
							'Treina o galo para adquirir mais força, Exemplo: "!r treinar Poderoso forca"'
						)
						.addField(
							"treinar [nome] defesa",
							'Treina o galo para adquirir mais resistencia, Exemplo: "!r treinar Poderoso defesa"'
						)
						.addField(
							"status [nome]",
							'Exibe todos dados do galo, Exemplo: "!r status Poderoso"'
						)
						.addField(
							"lutar [nome] [@oponente]",
							'Luta com outro Galo para ganhar moedas, Exemplo: "!r lutar Poderoso @Lucas"'
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
							} else {
								msg.reply(
									'Treine Força ou Defesa, outro treinamento ainda não é possivel para seu Galo, Exemplo: "!r treinar Poderoso forca"'
								);
							}
						}
					}
					break;

				case "status":
					if (commands[2] && commands[2] != "") {
						require("./status")(msg, commands[2]);
					}
					break;

				case "lutar":
					if (
						commands[2] &&
						commands[2] != "" &&
						commands[3] &&
						commands[3] != ""
					) {
						require("./fight")(
							msg,
							commands[2],
							commands[3].replace(/<@!/, "").replace(/>/, "")
						);
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
