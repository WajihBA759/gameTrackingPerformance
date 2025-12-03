const Category = require('../models/category');
const Game = require('../models/game');

/**

Collect all parameter names required by categories of a game.

Returns an array of unique parameter names (strings).
*/
async function collectRequiredCategoryParameters(gameId) {
const categories = await Category.find({ game: gameId });
const paramsSet = new Set();

for (const cat of categories) {
if (Array.isArray(cat.parameters)) {
for (const p of cat.parameters) {
if (p && p.name) paramsSet.add(p.name);
}
}
}

return Array.from(paramsSet);
}

/**

Validate provided fields for a new GameAccount.

Ensures the game's identifierKey exists in the provided data,

and that all category parameters are present.

@param {ObjectId} gameId

@param {Object} providedFields // e.g. { puuid, region, name, tag }

@returns {Object} { ok: boolean, missing: string[], identifierKey: string }
*/
async function validateGameAccountIdentifiers(gameId, providedFields = {}) {
const game = await Game.findById(gameId);
if (!game) throw new Error('Game not found');

const identifierKey = game.identifierKey; // e.g. "puuid"
const missing = [];

// identifierKey must be provided
if (!providedFields || providedFields[identifierKey] == null) {
missing.push(identifierKey);
}

// collect all category parameters for this game
const catParams = await collectRequiredCategoryParameters(gameId);
for (const name of catParams) {
if (providedFields[name] == null) {
missing.push(name);
}
}

return { ok: missing.length === 0, missing, identifierKey };
}

module.exports = { collectRequiredCategoryParameters, validateGameAccountIdentifiers };