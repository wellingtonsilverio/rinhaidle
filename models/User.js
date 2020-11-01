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
				product: { type: Types.ObjectId, ref: "Product" },
			},
		],
		default: [],
	},
});

module.exports = mongoose.model("User", UserSchema);
