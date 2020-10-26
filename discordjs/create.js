const Rooster = require("../models/Rooster");

module.exports = async (message, name) => {
	const userId = message.author.id;

	try {
		await Rooster.create({
			discordId: userId,
			name: name,
		});

		message.reply("Galo " + name + " criado com sucesso!");
	} catch (ex) {
		message.reply(
			"Aconteceu um erro ao criar o Galo, pode ser que o nome já é utilizado!"
		);
		console.log("try error createRooster: ", ex);
	}
};
