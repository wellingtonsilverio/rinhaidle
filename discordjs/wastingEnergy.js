const Rooster = require("../models/Rooster");

module.exports = (userId, name, value) => {
  const rooster = await Rooster.updateOne({
    discordId: userId,
    name: name,
  }, {
    $inc: { stamina: -value }
  });
};
