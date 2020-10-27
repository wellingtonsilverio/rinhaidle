const Rooster = require("../models/Rooster");

module.exports = () => {
	const recharge = async () => {
		try {
			const roosters = await Rooster.find({
				stamina: { $lt: 100 },
			});

			roosters.map((rooster) => {
				rooster.stamina += 5;

				if (rooster.stamina > 100) rooster.stamina = 100;
				
				await rooster.save();
			});

			setTimeout(() => {
				recharge();
			}, 1000 * 60 * 5);
		} catch (ex) {
			console.log("try error recharge: ", ex);
		}
	};

	recharge();
};
