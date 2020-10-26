"use strict";

/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * This service will provide database operation.
 */
const Joi = require("joi");
const logger = require("../../../common/logger");
const Rooster = require("../../../models/Rooster");

/**
 * Create new Rooster
 * @param {Object} rooster the new rooster
 */
function* createRooster(rooster) {
	const roosterObj = yield Rooster.create(rooster);
	return roosterObj;
}

createRooster.schema = {
	rooster: Joi.object({
		discordId: Joi.string().required(),
		name: Joi.string().required(),
		strength: Joi.number(),
		constitution: Joi.number(),
		stamina: Joi.number(),
	}),
};

/**
 * Get all Roosters
 * @param {Object} roosterQuery
 */
function* findRoosters(roosterQuery) {
	const rooster = yield Rooster.find(roosterQuery);
	return rooster;
}

findRoosters.schema = {
	roosterQuery: Joi.object({
		discordId: Joi.string(),
	}),
};

/**
 * Get By Rooster Id
 * @param {Object} id
 */
function* findRoosterById(id) {
	const rooster = yield Rooster.findById(id);
	return rooster;
}

/**
 * Update Rooster
 * @param {*} rooster
 * @param {*} id
 */
function* updateRooster(rooster, id) {
	const roosterObj = yield Rooster.updateOne({ _id: id }, rooster);
	return roosterObj;
}

updateRooster.schema = {
	rooster: Joi.object({
		discordId: Joi.string().required(),
		strength: Joi.number(),
		constitution: Joi.number(),
		stamina: Joi.number(),
	}),
	id: Joi.string(),
};

/**
 * Update Rooster by id
 * @param {*} rooster
 * @param {*} id
 */
function* deleteRooster(id) {
	const roosterObj = yield Rooster.deleteOne({ _id: id });
	return roosterObj;
}

module.exports = {
	createRooster,
	findRoosters,
	findRoosterById,
	updateRooster,
	deleteRooster,
};

logger.buildService(module.exports);
