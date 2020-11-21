const User = require("../models/User");

module.exports = async (userId, points) => {
	try {
		const user = await User.findOne({
			discordId: userId,
		});

		if (user && user.discordId) {
			if (!user.coins) user.coins = 0;

			user.coins += points;

			user.save();
		} else {
			await User.create({
				discordId: userId,
				coins: points,
			});
		}
	} catch (ex) {
		const random = Math.random() * 999999999;
		message.reply(
			"Aconteceu um erro ao adicionar moedas! user: " +
				userId +
				" cód: " +
				random
		);
		console.log("try error add-coin: " + random + " ", ex);
	}
};
