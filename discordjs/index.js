"use strict";

const Discordjs = require("discord.js");

const client = new Discordjs.Client();

module.exports = (config) => {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);

		require("./recharge")();
	});

	client.on("message", (msg) => {
		if (msg.content.startsWith("!r")) {
			// msg.delete();
			const commands = msg.content.split(" ");
			switch (commands[1]) {
				case "ajuda":
				case "help":
					require("./help")(msg);
					break;

				case "chocar":
					if (commands[2] && commands[2] != "") {
						require("./create")(msg, commands[2]);
					}
					break;

				case "treinar":
					if (commands[2] && commands[2] != "") {
						if (commands[3] && commands[3] != "") {
							const type =
								commands[3] === "forca" ||
								commands[3] === "ataque" ||
								commands[3] === "f" ||
								commands[3] === "a"
									? 1
									: commands[3] === "defesa" ||
									  commands[3] === "vida" ||
									  commands[3] === "d" ||
									  commands[3] === "v"
									? 2
									: 0;
							if (type !== 0) {
								require("./training")(msg, commands[2], type);
							} else {
								msg.reply(
									'Treine Ataque ou Defesa, outro treinamento ainda não é possivel para seu Galo, Exemplo: "!r treinar Poderoso ataque"'
								);
							}
						}
					}
					break;

				case "status":
					if (commands[2] && commands[2] != "") {
						require("./status")(msg, commands[2]);
					} else {
						require("./status-me")(msg);
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

				case "comprar":
					if (commands[2] && commands[2] != "") {
						require("./buy-product")(msg, commands[2]);
					} else {
						require("./products")(msg);
					}
					break;

				case "equipar":
				case "usar":
					if (
						commands[2] &&
						commands[2] != "" &&
						commands[3] &&
						commands[3] != ""
					) {
						require("./useItem")(msg, commands[2], commands[3]);
					}
					break;

				case "remover":
					if (
						commands[2] &&
						commands[2] != "" &&
						commands[3] &&
						commands[3] != ""
					) {
						require("./removeItem")(msg, commands[2], commands[3]);
					}
					break;

				case "ranking":
					require("./ranking")(msg);
					break;

				default:
					msg.reply("Oi?");
					break;
			}
		}
	});

	client.login(config.discordtoken);
};
