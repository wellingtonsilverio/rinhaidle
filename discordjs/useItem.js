const Product = require("../models/Product");
const Material = require("../models/Material");
const Rooster = require("../models/Rooster");
const User = require("../models/User");

module.exports = async (message, name, _productName) => {
	console.log("entrou useItem", name, _productName);
	const userId = message.author.id;
	const [productName, productMaterial] = _productName.split("-");

	try {
		const user = await User.findOne({ discordId: userId });
		const product = await Product.findOne({ ext: productName }).lean();
		const rooster = await Rooster.findOne({
			discordId: userId,
			name: name,
		});

		if (product) {
			if (product.type === "food") {
				console.log("food");
				user.inventory.map(async (_item) => {
					console.log(
						"_item._product product._id",
						_item._product,
						product._id
					);
					if (_item._product === product._id) {
						rooster.stamina += product.bonus.stamina;
						_item = undefined;

						await rooster.save();
						await user.save();

						message.reply(`O galo ${rooster.name} usou ${product.name}`);

						return;
					}
				});
			} else {
				if (productMaterial) {
					const material = await Material.findOne({
						ext: productMaterial,
					}).lean();

					user.inventory.map(async (_item) => {
						if (
							_item._product === product._id &&
							_item._material === material._id
						) {
							rooster.equipments.push({
								_product: _item._product,
								_material: _item._material,
							});
							_item = undefined;

							await rooster.save();
							await user.save();

							message.reply(
								`O galo ${rooster.name} equipou ${product.name} de ${material.name}`
							);

							return;
						}
					});
				} else {
					user.inventory.map(async (_item) => {
						if (_item._product === product._id) {
							rooster.equipments.push({
								_product: _item._product,
							});
							_item = undefined;

							await rooster.save();
							await user.save();

							message.reply(`O galo ${rooster.name} equipou ${product.name}`);

							return;
						}
					});
				}
			}
		}
	} catch (error) {}
};
