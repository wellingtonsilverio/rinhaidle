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

		const guild = message.guild;
		let channelFight = await guild.createChannel(`fight-${rooster.name}`, {
			type: "text",
			// parent: '746161473843232798',
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
		});

		channelFight.send(`<@${opponentId}> Escolha seu Galo: `);
		opponentRoosters.map((opponentRooster, index) => {
			channelFight.send(`${index + 1}: ${opponentRooster.name}`);
		});

		const collector = new Discordjs.MessageCollector(
			channelFight,
			(m) => m.author.id === opponentId,
			{ time: 1000 * 60 * 5 }
		);
		collector.on("collect", (message) => {
			const roosterId = Number(message.content) - 1;
			if (opponentRoosters[roosterId]) {
				channelFight.send(JSON.stringify(opponentRoosters[roosterId]));
			}
		});
	} catch (ex) {
		message.reply("Aconteceu um erro ao exibir os status do seu Galo!");
		console.log("try error status: ", ex);
	}
};
