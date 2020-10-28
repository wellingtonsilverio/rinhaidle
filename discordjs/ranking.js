const Rooster = require("../models/Rooster");

module.exports = () => {
  const ranking = async () => {
    try {
      const roosters = await Rooster.find({
        victoryPoints: { $gt: 0 },
      });
      roosters.map(async (rooster) => {});
    } catch (ex) {
      console.log("try error recharge: ", ex);
    }
  };
};
