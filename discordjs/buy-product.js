const Product = require("../models/Product");
const Material = require("../models/Material");

module.exports = async (message, name) => {
	const buy = () => {};

	try {
		const [productName, productMaterial] = name.split("-");

		const product = await Product.findOne({ ext: productName }).lean();

		if (product) {
			if (productMaterial) {
				const material = await Material.findOne({
					ext: productMaterial,
				}).lean();

				if (material) {
					buy();
					return;
				}
			}

			buy();
			return;
		}
	} catch (ex) {
		message.reply(
			"Aconteceu um erro ao comprar o produto, tente novamente mais tarde!"
		);
		console.log("try error buy-product: ", ex);
	}
};
