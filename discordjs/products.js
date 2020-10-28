const Discordjs = require("discord.js");
const User = require("../models/User");

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
					strength: 0.06,
				},
				price: 600,
			},
			{
				name: "Armadura",
				ext: "armadura",
				bonus: {
					constitution: 0.06,
				},
				price: 600,
			},
			{
				name: "Calça",
				ext: "calca",
				bonus: {
					constitution: 0.04,
				},
				price: 400,
			},
			{
				name: "Bota",
				ext: "bota",
				bonus: {
					constitution: 0.02,
					strength: 0.03,
				},
				price: 500,
			},
			{
				name: "Chapeu",
				ext: "chapeu",
				bonus: {
					constitution: 0.02,
				},
				price: 200,
			},
			{
				name: "Óculos",
				ext: "oculos",
				bonus: {
					constitution: 0.03,
				},
				price: 300,
			},
			{
				name: "Rabo",
				ext: "rabo",
				bonus: {
					constitution: 0.03,
					strength: 0.03,
				},
				price: 600,
			},
			{
				name: "Esporas",
				ext: "esporas",
				bonus: {
					strength: 0.03,
				},
				price: 300,
			},
			{
				name: "Crista",
				ext: "crista",
				bonus: {
					constitution: 0.01,
					strength: 0.01,
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
				multiplier: 10,
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
	const user = await User.findOne({
		discordId: userId,
	});

	const embed = new Discordjs.MessageEmbed()
		.setTitle("Comprar")
		.setDescription("Lista de todos produtos disponiveis para compra")
		.setColor([203, 153, 126])
		.addFields(
			{ name: "Dinheiro", value: `${user.coins}` },
			{ name: "\u200B", value: "\u200B" },
			{ name: "Comidas", value: "\u200B" },
			...products.foods.map((food) => ({
				name: food.ext,
				value: `Stamina: +${food.bonus}  Preço: ${food.price}`,
				inline: true,
			})),
			{ name: "\u200B", value: "\u200B" }
		);
	products.materials.map((material) => {
		embed.addField("Equipamentos", material.name);
		embed.addFields(
			...products.equipments.map((equipment) => ({
				name: `${equipment.ext}-${material.ext}`,
				value: `Força: +${
					equipment.bonus.strength * material.multiplier
				}%  Defesa: +${
					equipment.bonus.constitution * material.multiplier
				}%  Preço: ${equipment.price * material.multiplier}`,
				inline: true,
			}))
		);
	});
	message.reply(embed);
};
