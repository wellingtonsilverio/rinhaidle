"use strict";

const discordjs = require("discord.js");

const client = new discordjs.Client();

module.exports = (config) => {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

	client.on("message", (msg) => {
		//msg.authorID
		if (msg.content.startsWith("!r")) {
			if (msg.content.split(" ").includes("help")) {
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
			}
		}
	});

	client.login(config.discordtoken);
};
