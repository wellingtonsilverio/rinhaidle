const User = require("../models/User");

module.exports = async (userId) => {
	try {
		const user = await User.findOne({
			discordId: userId,
		});

		if (typeof user === User) {
			user.coins += 100;
			user.save();
		} else {
			await User.create({
				discordId: userId,
				coins: 100,
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
