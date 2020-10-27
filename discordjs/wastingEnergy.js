const Rooster = require("../models/Rooster");

module.exports = async (userId, name, value) => {
	try {
		await Rooster.updateOne(
			{
				discordId: userId,
				name: name,
			},
			{
				$inc: { stamina: -value },
			}
		);
	} catch (ex) {
		console.log("try error wastingEnergy: ", ex);
	}
};
