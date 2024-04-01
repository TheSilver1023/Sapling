import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Event from 'stickycore/event'

const LOOT_TABLES = {
	'minecraft:guardian': {
		property: 'guardianDropSponges',
		item: 'minecraft:sponge',
		amount: () => 1
	},
	'minecraft:ghast': {
		property: 'ghastDropQuartz',
		item: 'minecraft:quartz',
		amount: () => Math.floor(Math.random()*6) || 1
	},
	'minecraft:husk': {
		property: 'huskDropSand',
		item: 'minecraft:sand',
		amount: () => Math.floor(Math.random()*4) || 1
	},
	'minecraft:silverfish': {
		property: 'silverfishDropGravel',
		item: 'minecraft:gravel',
		amount: () => 1
	}
};

Event.afterTrack('entityDie', (ev) => {
	const { deadEntity } = ev;
	let loot = LOOT_TABLES[deadEntity.typeId]
	if (!loot) return;
	else if (Math.floor(Math.random()*2) == 0) return;
	else if (!Dynamic.getData(loot.property)) return;
	// Drop
	let item = new mc.ItemStack(loot.item, loot.amount());
	deadEntity.dimension.spawnItem(item, deadEntity.location)
}, { parser: false });