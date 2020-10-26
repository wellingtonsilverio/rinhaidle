"use strict";

/*
 * Copyright (c) 2016 TopCoder, Inc. All rights reserved.
 */

/**
 * This controller exposes database REST action.
 */
const RoosterService = require("../services/Rooster");

/**
 * Create rooster
 * @param req the request
 * @param res the response
 */
function* createRooster(req, res, next) {
	try {
		const rooster = yield RoosterService.createRooster(req.body);
		res.status(200).json(rooster);
	} catch (ex) {
		next(ex);
	}
}

/**
 * Update rooster by id
 * @param req the request
 * @param res the response
 */

function* updateRooster(req, res, next) {
	try {
		const roosters = yield RoosterService.updateRooster(
			req.body,
			req.params.id
		);
		res.status(200).json(roosters);
	} catch (ex) {
		next(ex);
	}
}

/* delete rooster by id
 * @param req the request
 * @param res the response
 */

function* deleteRooster(req, res, next) {
	try {
		const roosters = yield RoosterService.deleteRooster(req.params.id);
		res.status(200).json(roosters);
	} catch (ex) {
		next(ex);
	}
}

/**
 * get rooster by id
 * @param req the request
 * @param res the response
 */
function* getRoosterById(req, res, next) {
	try {
		const roosters = yield RoosterService.findRoosterById(req.params.id);
		res.status(200).json(roosters);
	} catch (ex) {
		next(ex);
	}
}

/**
 * get all rooster
 * @param req the request
 * @param res the response
 */
function* getRoosters(req, res, next) {
	try {
		const roosters = yield RoosterService.findRoosters(req.query);
		res.status(200).json(roosters);
	} catch (ex) {
		next(ex);
	}
}

module.exports = {
	createRooster,
	getRoosters,
	getRoosterById,
	updateRooster,
	deleteRooster,
};
