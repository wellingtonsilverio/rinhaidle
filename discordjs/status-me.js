const Discordjs = require("discord.js");
const Rooster = require("../models/Rooster");
const User = require("../models/User");

module.exports = async (message) => {
	const userId = message.author.id;

	try {
		const user = await User.findOne({
			discordId: userId,
		});

		const roosters = await Rooster.find({
			discordId: userId,
		});

		const embed = new Discordjs.MessageEmbed()
			.setTitle("Perfil")
			.setColor([10, 10, 255])
			.addField("Dinheiro", user.coins)
			.addField(
				"Galos",
				JSON.stringify(roosters.map((rooster) => rooster.name))
			);
		message.reply(embed);
	} catch (ex) {
		message.reply("Aconteceu um erro ao exibir os status do seu Galo!");
		console.log("try error status: ", ex);
	}
};
