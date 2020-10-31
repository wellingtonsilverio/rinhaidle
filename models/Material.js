"use strict";

/**
 * The Material model
 */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const MaterialSchema = new Schema({
	name: { type: String, required: true },
	ext: { type: String, required: true, unique: true },
	multiplier: { type: Number, required: true },
});

module.exports = mongoose.model("Material", MaterialSchema);
