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
			.addField("Força", rooster.strength, true)
			.addField("Vida", rooster.constitution, true)
			.addField("Stamina", rooster.stamina, true)
			.addField(
				"Inventário",
				JSON.stringify(
					(await Promise.all(
						rooster?.equipments?.map(async (item) => {
							console.log("item", item);
							const product = await Product.findById(item._product).lean();
							console.log("product", product);

							if (item._material) {
								const material = await Material.findById(item._material).lean();
								return `${product.ext} de ${material.ext}`;
							}

							return product.ext;
						}) ?? [""]
					)) ?? [""]
				)
			);
		message.reply(embed);
	} catch (ex) {
		message.reply("Aconteceu um erro ao exibir os status do seu Galo!");
		console.log("try error status: ", ex);
	}
};
