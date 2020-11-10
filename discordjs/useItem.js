const Product = require("../models/Product");
const Material = require("../models/Material");
const Rooster = require("../models/Rooster");
const User = require("../models/User");

module.exports = async (message, name, _productName) => {
	const userId = message.author.id;
	const [productName, productMaterial] = _productName.split("-");

	try {
		const user = await User.findOne({ discordId: userId });
		const product = await Product.findOne({ ext: productName }).lean();
		const rooster = await Rooster.findOne({
			discordId: userId,
			name: name,
		});

		for (const item of user.inventory) {
			if (String(item._product) === String(product._id)) {
				if (product.type === "food") {
					await rooster.updateOne(
						{ discordId: userId, name: name },
						{ $inc: { stamina: product.bonus.stamina } }
					);
					await User.updateOne(
						{ discordId: userId },
						{ inventory: { $pull: { _id: [item._id] } } }
					);

					message.reply(`O galo ${rooster.name} usou ${product.name}`);

					return;
				}
			}
		}

		// if (product) {
		// 	if (product.type === "food") {
		// 		user.inventory.map((_item) => {
		// 			if (String(_item._product) === String(product._id)) {
		// 				const update = async () => {
		// 					rooster.stamina += product.bonus.stamina;
		// 					_item = undefined;

		// 					console.log("rooster", rooster);
		// 					console.log("user", user);

		// 					// await rooster.save();
		// 					// await user.save();

		// 					message.reply(`O galo ${rooster.name} usou ${product.name}`);
		// 				};
		// 				update();

		// 				return;
		// 			}
		// 		});
		// 	} else {
		// 		if (productMaterial) {
		// 			const material = await Material.findOne({
		// 				ext: productMaterial,
		// 			}).lean();

		// 			user.inventory.map((_item) => {
		// 				if (
		// 					String(_item._product) === String(product._id) &&
		// 					String(_item._material) === String(material._id)
		// 				) {
		// 					const update = async () => {
		// 						rooster.equipments.push({
		// 							_product: _item._product,
		// 							_material: _item._material,
		// 						});
		// 						_item = undefined;

		// 						await rooster.save();
		// 						await user.save();

		// 						message.reply(
		// 							`O galo ${rooster.name} equipou ${product.name} de ${material.name}`
		// 						);
		// 					};

		// 					update();

		// 					return;
		// 				}
		// 			});
		// 		} else {
		// 			user.inventory.map(async (_item) => {
		// 				if (String(_item._product) === String(product._id)) {
		// 					const update = async () => {
		// 						rooster.equipments.push({
		// 							_product: _item._product,
		// 						});
		// 						_item = undefined;

		// 						await rooster.save();
		// 						await user.save();

		// 						message.reply(`O galo ${rooster.name} equipou ${product.name}`);
		// 					};

		// 					update();

		// 					return;
		// 				}
		// 			});
		// 		}
		// 	}
		// }
	} catch (ex) {
		message.reply(`Aconteceu um erro ao usar o item!`);
		console.log("try error useItem: ", ex);
	}
};
