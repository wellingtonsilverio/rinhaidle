const User = require("../models/User");

module.exports = async (userId, points) => {
	try {
		const user = await User.findOne({
			discordId: userId,
		});

		if (user && user.discordId) {
			if (!user.victoryPoints) user.victoryPoints = 0;

			user.victoryPoints += points;

			user.save();
		} else {
			await User.create({
				discordId: userId,
				victoryPoints: points,
			});
		}
	} catch (ex) {
		const random = Math.random() * 999999999;
		message.reply(
			"Aconteceu um erro ao adicionar pontos de vítoria! user: " +
				userId +
				" cód: " +
				random
		);
		console.log("try error add-victory-points: " + random + " ", ex);
	}
};
