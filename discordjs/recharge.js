const Rooster = require("../models/Rooster");

module.exports = () => {
	const recharge = async () => {
		try {
			const roosters = await Rooster.find({
				stamina: { $lt: 100 },
			});

			roosters.map(async (rooster) => {
				if (rooster.stamina >= 100) return;

				rooster.stamina += 1;

				await rooster.save();
			});
		} catch (ex) {
			console.log("try error recharge: ", ex);
		}

		setTimeout(() => {
			recharge();
		}, 1000 * 60 * 5);
	};

	recharge();
};
