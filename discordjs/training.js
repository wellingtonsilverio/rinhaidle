const dayjs = require("dayjs");
const Rooster = require("../models/Rooster");

module.exports = async (message, name, type) => {
	const userId = message.author.id;

	const trainingName = { 1: "strength", 2: "constitution" };
	const incQuery = {};
	incQuery[trainingName[type]] = type === 1 ? 10 : 100;

	try {
		const stamina = await require("./get-stamina")(userId, name);

		if (stamina < 20) {
			message.reply("Seu Galo está cansado, espere um pouco para treina-lo");
			return;
		}
	} catch (error) {
		message.reply("Erro ao verificar a stamina do Galo");
		return;
	}

	try {
		const rooster = await Rooster.findOne({
			discordId: userId,
			name: name,
		}).lean();

		if (rooster.training && rooster.training.init) {
			if (dayjs().isBefore(dayjs(rooster.training.init))) {
				message.reply(
					"Galo " +
						name +
						" já está treinando, espere até " +
						dayjs(rooster.training.init)
							.subtract(3, "hour")
							.add(1, "minute")
							.format("HH:mm")
				);
				return;
			}
		}

		const finalDate = dayjs().add(type === 1 ? 20 : 30, "minute");
		await Rooster.updateOne(
			{
				discordId: userId,
				name: name,
			},
			{
				$set: {
					training: {
						type,
						init: finalDate,
					},
				},
				$inc: incQuery,
			}
		);
		require("./wastingEnergy")(userId, name, 20);

		message.reply(
			"Galo " +
				name +
				" comecou a treinar, o treino termina as " +
				finalDate.subtract(3, "hour").add(1, "minute").format("HH:mm")
		);
	} catch (ex) {
		message.reply(
			"Aconteceu um erro ao treinar o Galo, pode ser que o nome esteja errado ou você não é dono desse galo!"
		);
		console.log("try error training: ", ex);
	}
};
