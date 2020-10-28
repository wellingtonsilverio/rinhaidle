const Discordjs = require("discord.js");

module.exports = async (message) => {
	const userId = message.author.id;

	const products = {
		foods: [
			{
				name: "Quirela",
				ext: "quirela",
				bonus: 5,
				price: 100,
			},
			{
				name: "Milho",
				ext: "milho",
				bonus: 10,
				price: 150,
			},
			{
				name: "Arroz",
				ext: "arroz",
				bonus: 25,
				price: 300,
			},
			{
				name: "Pipoca",
				ext: "pipoca",
				bonus: 30,
				price: 350,
			},
			{
				name: "Whey",
				ext: "whey",
				bonus: 50,
				price: 500,
			},
			{
				name: "Red Bull",
				ext: "redbull",
				bonus: 80,
				price: 600,
			},
		],
		equipments: [
			{
				name: "Bico",
				ext: "bico",
				bonus: {
					strength: 0.006,
				},
				price: 600,
			},
			{
				name: "Armadura",
				ext: "armadura",
				bonus: {
					constitution: 0.006,
				},
				price: 600,
			},
			{
				name: "Calça",
				ext: "calca",
				bonus: {
					constitution: 0.004,
				},
				price: 400,
			},
			{
				name: "Bota",
				ext: "bota",
				bonus: {
					constitution: 0.002,
					strength: 0.003,
				},
				price: 500,
			},
			{
				name: "Chapeu",
				ext: "chapeu",
				bonus: {
					constitution: 0.002,
				},
				price: 200,
			},
			{
				name: "Óculos",
				ext: "oculos",
				bonus: {
					constitution: 0.003,
				},
				price: 300,
			},
			{
				name: "Rabo",
				ext: "rabo",
				bonus: {
					constitution: 0.003,
					strength: 0.003,
				},
				price: 600,
			},
			{
				name: "Esporas",
				ext: "esporas",
				bonus: {
					strength: 0.003,
				},
				price: 300,
			},
			{
				name: "Crista",
				ext: "crista",
				bonus: {
					constitution: 0.001,
					strength: 0.001,
				},
				price: 200,
			},
		],
		materials: [
			{
				name: "Plástico",
				ext: "platico",
				multiplier: 1,
			},
			{
				name: "Madeira",
				ext: "madeira",
				multiplier: 5,
			},
			{
				name: "Aluminio",
				ext: "madeira",
				multiplier: 25,
			},
			{
				name: "Ferro",
				ext: "ferro",
				multiplier: 40,
			},
			{
				name: "Diamante",
				ext: "diamante",
				multiplier: 100,
			},
		],
	};

	const foods = new Discordjs.MessageEmbed()
		.setTitle("Comidas")
		.setDescription("Use para restaurar a stamina")
		.setColor([203, 153, 126])
		.addFields(
			{ name: "\u200B", value: "\u200B" },
			...products.foods.map((food) => ({
				name: food.ext,
				value: `Stamina: +${food.bonus}\nPreço: ${food.price}`,
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
};
