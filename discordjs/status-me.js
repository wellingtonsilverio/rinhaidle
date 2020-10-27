const Discordjs = require("discord.js");
const Rooster = require("../models/Rooster");
const User = require("../models/User");

module.exports = async (message) => {
	const userId = message.author.id;

	try {
		const user = await User.findOne({
			discordId: userId,
		}).lean();

		const roosters = await Rooster.find({
			discordId: userId,
		}).lean();

		const embed = new Discordjs.MessageEmbed()
			.setTitle("Perfil")
			.setColor([221, 190, 169])
			.addField("Dinheiro", user && user.coins ? user.coins : 0)
			.addField(
				"Galos",
				JSON.stringify(roosters.map((rooster) => rooster.name))
			);
		message.reply(embed);
	} catch (ex) {
		message.reply("Aconteceu um erro ao exibir os status do seu Galo!");
		console.log("try error status-me: ", ex);
	}
};
