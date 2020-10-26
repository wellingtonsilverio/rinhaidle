"use strict";

const discordjs = require("discord.js");

const client = new discordjs.Client();

module.exports = (config) => {
	client.on("ready", () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

	client.on("message", (msg) => {
		msg.reply(JSON.stringify(msg));
		if (msg.content === "ping") {
			msg.reply("pong");
		}
	});

	client.login(config.discordtoken);
};
