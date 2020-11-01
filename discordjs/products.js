const Discordjs = require("discord.js");
const Product = require("../models/Product");
const Material = require("../models/Material");

module.exports = async (message) => {
	try {
		const products = {
			foods: await Product.find({ type: "food" }).lean(),
			equipments: await Product.find({ type: "equipment" }).lean(),
			materials: await Material.find({}).lean(),
		};

		const foods = new Discordjs.MessageEmbed()
			.setTitle("Comidas")
			.setDescription("Use para restaurar a stamina")
			.setColor([203, 153, 126])
			.addFields(
				{ name: "\u200B", value: "\u200B" },
				...products.foods.map((food) => ({
					name: food.ext,
					value: `Stamina: +${food.bonus.stamina}\nPreço: ${food.price}`,
					inline: true,
				}))
			);
		message.reply(foods);

		products.materials.map((material) => {
			const embed = new Discordjs.MessageEmbed()
				.setTitle("Equipamentos - " + material.name)
				.setDescription("Use para equipar um Galo")
				.setColor([203, 153, 126])
				.addFields(
					{ name: "\u200B", value: "\u200B" },
					...products.equipments.map((equipment) => ({
						name: `${equipment.ext}-${material.ext}`,
						value: `${
							equipment.bonus.strength > 0
								? "Força: +" +
								  equipment.bonus.strength * material.multiplier * 100 +
								  "%\n"
								: ""
						}${
							equipment.bonus.constitution > 0
								? "Defesa: +" +
								  equipment.bonus.constitution * material.multiplier * 100 +
								  "%\n"
								: ""
						}Preço: ${equipment.price * material.multiplier}`,
						inline: true,
					}))
				);
			message.reply(embed);
		});
	} catch (ex) {
		message.reply(
			"Aconteceu um erro ao exibir a lista de produtos, tente novamente mais tarde!"
		);
		console.log("try error product-list: ", ex);
	}
};
