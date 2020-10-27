const Rooster = require("../models/Rooster");

module.exports = () => {
	const recharge = async () => {
		try {
			const roosters = await Rooster.find({
				stamina: { $lt: 100 },
			});

			roosters.map(async (rooster) => {
				rooster.stamina += 5;

				if (rooster.stamina > 100) rooster.stamina = 100;

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
