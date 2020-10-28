const Rooster = require("../models/Rooster");

module.exports = async (userId, name) => {
	try {
		const rooster = await Rooster.findOne({
			discordId: userId,
			name: name,
		}).lean();

		return rooster.stamina;
	} catch (ex) {
		console.log("try error get-stamina: ", ex);
	}
};
