import Dynamic, { module } from 'stickycore/dynamic'
import World from 'stickycore/world'

// Databases
const sapling = newDB([
	// TNT 
	'tntDuping',
	'tntDropAllBlocks',
	'tntDropIce',
	'tntNotExplodes',
	'tntNoDrops',
	'tntDispenserRefill',
	// Entity
	'guardianDropSponges',
	'ghastDropQuartz',
	'huskDropSand',
	'silverfishDropGravel',
	'pigmanFarmWarts',
	'ravagerDestroyCherryLeaves',
	'entityCramming',
	// World
	'endPortalGBD',
	'cauldronBedrockBreaker',
	'anvilBedrockBreaker',
	'signBedrockBreaker',
	'renewableSoulSand',
	// Tools
	'flippinCactus',
	'instamineObsidian',
	'instamineDeepslate',
	'toolChanger',
	'silkTouchGetSpawners',
	'silkTouchGetBuddingAmethyst',
	'dynamicLight'
]);

const func = newDB([
	'chunkBorders',
	'slimeChunks',
	'tpBoxes',
	'redstoneIndicator',
	'chestPeek',
	'tntBlocks',
	'fakeHss',
	'infoDisplay',
	'lightIndicator'
]);

const cameras = newDB([
	'free',
	'reset',
	'static'
], false);

const fpr = ['jump','attack','shift','use','drop','interact']
const fakeplayer = newDB([
	'spawn',
	'spawn:world',
	'kill',
	'teleport',
	'jump',
	'attack',
	'shift',
	'interact',
	'trident',
	...Array.from({ length: 9 }, (_, i) => `use:${i}`),
	...Array.from({ length: 9 }, (_, i) => `drop:${i}`),
	...Array.from({ length: 9 }, (_, i) => `select:${i}`),
	...Array.from({ length: fpr.length }, (_, i) => `repeat:${fpr[i]}`),
	'stop'
], false);

const hss = newDB([
	'SwampHut',
	'PillagerOutpost',
	'NetherFortress',
	'OceanMonument'
], false);

const config = newDB([
	'gameRulesFix',
	'setAllValues'
])

// Guides
const fakeplayer_guide = newDB([
	'spawn:[?world]',
	'kill',
	'teleport',
	'jump §e*',
	'attack §e*',
	'shift §e*',
	'interact §e*',
	'use:[0-9] §e*',
	'trident',
	'drop:[0-9] §e*',
	'select:[0-9]',
	'repeat:[§e*§7]',
	'stop'
], false)


const hss_guide = newDB([
	'create §b"<x> <y> <z> <dimension> <hss type>"',
	'remove §b<hss uuid>',
	'list §b<hss type>'
], false);

const config_guide = newDB([
	'lang §b<EN/ES/PT/JA/ZH> §u$',
	'gameRulesFix §b<boolean>',
	'setAllValues §b<boolean>'
], false);

// Langs
World.runCommand('function sapling_db');
if (!Dynamic.getData('lang')) {
	new Dynamic('boolean', 'lang');
	Dynamic.setData('lang', 'EN');
}


// Exports
module({
	sapling, 
	func, 
	cameras, 
	fakeplayer,
	hss,
	config,
	
	fakeplayer_guide,
	hss_guide,
	config_guide
});

// Funcions
function newDB(arr, db = true) {
	let struct = {};
	arr.forEach(_ => {
		struct[_.toLowerCase()] = _;
		if (db) new Dynamic('boolean', _);
	});
	
	return struct;
}