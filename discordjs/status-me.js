const Discordjs = require("discord.js");
const Rooster = require("../models/Rooster");
const User = require("../models/User");
const Product = require("../models/Product");
const Material = require("../models/Material");

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
			.addField("Moedas", user && user.coins ? user.coins : 0)
			.addField(
				"Galos",
				JSON.stringify(roosters.map((rooster) => rooster.name))
			)
			.addField(
				"Inventário",
				JSON.stringify(
					await Promise.all(
						user.inventory.map(async (item) => {
							const product = await Product.findById(item._product).lean();

							if (item._material) {
								const material = await Material.findById(item._material).lean();
								return `${product.name} de ${material.name}`;
							}

							return product.name;
						})
					)
				)
			);
		message.reply(embed);
	} catch (ex) {
		message.reply("Aconteceu um erro ao exibir os status do seu Galo!");
		console.log("try error status-me: ", ex);
	}
};
