const Rooster = require("../models/Rooster");

module.exports = (userId, name, value) => {
  

  try {
    const rooster = await Rooster.updateOne({
      discordId: userId,
      name: name,
    }, {
      $inc: { stamina: -value }
    });
  } catch (ex) {
    console.log("try error wastingEnergy: ", ex);
  }
};
