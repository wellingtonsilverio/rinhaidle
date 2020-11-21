const Discordjs = require("discord.js");
const Rooster = require("../models/Rooster");

module.exports = async (message) => {
	try {
		const embed = new Discordjs.MessageEmbed()
			.setTitle("Ranking")
			.setColor([203, 153, 126]);

		const roosters = await Rooster.find({
			victoryPoints: { $gt: 0 },
		}).lean();

		roosters
			.sort((a, b) => {
				return a.victoryPoints - b.victoryPoints;
			})
			.slice(0, 10)
			.map((rooster, index) => {
				embed.addField(
					`#${index + 1}`,
					`${rooster.name} de <@!${rooster.discordId}>`
				);
			});

		message.reply(embed);
	} catch (ex) {
		console.log("try error ranking: ", ex);
	}
};
