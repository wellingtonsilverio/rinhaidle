const Discordjs = require("discord.js");
const Rooster = require("../models/Rooster");

module.exports = async (message, name) => {
	const userId = message.author.id;

	try {
		const rooster = await Rooster.findOne({
			discordId: userId,
			name: name,
		}).lean();

		const embed = new Discordjs.MessageEmbed()
			.setTitle(rooster.name)
			.setColor([165, 165, 141])
			.addField("Força", rooster.strength)
			.addField("Vida", rooster.constitution)
			.addField("Stamina", rooster.stamina);
		message.reply(embed);
	} catch (ex) {
		message.reply("Aconteceu um erro ao exibir os status do seu Galo!");
		console.log("try error status: ", ex);
	}
};
