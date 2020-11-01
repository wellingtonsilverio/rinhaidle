const Product = require("../models/Product");
const Material = require("../models/Material");
const User = require("../models/User");

module.exports = async (message, name) => {
	const userId = message.author.id;

	const buy = async (_product, _material) => {
		const user = await User.findOne({ discordId: userId });

		user.inventory.push({
			_product,
			...(_material ? { _material } : {}),
		});

		await user.save();

		message.reply("Compra feita com sucesso!");
	};

	try {
		const [productName, productMaterial] = name.split("-");

		const product = await Product.findOne({ ext: productName }).lean();

		if (product) {
			if (productMaterial) {
				const material = await Material.findOne({
					ext: productMaterial,
				}).lean();

				if (material) {
					buy(product._id, material._id);
					return;
				}
			}

			buy(product._id, undefined);
			return;
		}
	} catch (ex) {
		message.reply(
			"Aconteceu um erro ao comprar o produto, tente novamente mais tarde!"
		);
		console.log("try error buy-product: ", ex);
	}
};
