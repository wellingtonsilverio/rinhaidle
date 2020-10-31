"use strict";

/**
 * The Product model
 */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProductSchema = new Schema({
	type: { type: String, required: true, enum: ["food", "equipment"] },
	name: { type: String, required: true },
	ext: { type: String, required: true, unique: true },
	bonus: {
		stamina: { type: Number },
		strength: { type: Number },
		constitution: { type: Number },
	},
	price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", ProductSchema);
