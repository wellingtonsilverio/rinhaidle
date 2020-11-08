"use strict";

/**
 * The Rooster model
 */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const RoosterSchema = new Schema({
	discordId: { type: String, required: true },
	name: { type: String, required: true, unique: true },
	strength: { type: Number, required: false, default: 10 },
	constitution: { type: Number, required: false, default: 10 },
	stamina: { type: Number, required: false, default: 100 },
	training: {
		type: { type: Number, required: false },
		init: { type: Date, required: false },
	},
	equipments: {
		type: [
			{
				_product: { type: Types.ObjectId, ref: "Product" },
				_material: { type: Types.ObjectId, ref: "Material" },
			},
		],
		default: [],
	},
});

module.exports = mongoose.model("Rooster", RoosterSchema);
