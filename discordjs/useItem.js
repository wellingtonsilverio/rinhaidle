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

		let found = false;
		user.inventory = user.inventory
			.map((item) => {
				if (found) return item;

				if (String(item._product) === String(product._id)) {
					if (product.type === "food") {
						rooster.stamina += product.bonus.stamina;

						message.reply(`O galo ${rooster.name} usou ${product.name}`);

						found = true;

						return undefined;
                    }
                    
                    if (product.type === "equipment") {
                        rooster.equipments.push(item);

                        found = true;

						return undefined;
                    }
				}

				return item;
			})
			.filter((item) => item !== undefined);

		await rooster.save();
		await user.save();
	} catch (ex) {
		message.reply(`Aconteceu um erro ao usar o item!`);
		console.log("try error useItem: ", ex);
	}
};
