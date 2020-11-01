"use strict";

/**
 * The User model
 */
const mongoose = require("mongoose");

const { Schema, Types } = mongoose;

const UserSchema = new Schema({
	discordId: { type: String, required: true },
	coins: { type: Number, required: false, default: 0 },
	inventory: {
		type: [
			{
				_product: { type: Types.ObjectId, ref: "Product" },
				_material: { type: Types.ObjectId, ref: "Material" },
			},
		],
		default: [],
	},
});

module.exports = mongoose.model("User", UserSchema);
