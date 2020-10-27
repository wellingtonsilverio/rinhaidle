"use strict";

/**
 * The User model
 */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
	discordId: { type: String, required: true },
	coins: { type: Number, required: false, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
