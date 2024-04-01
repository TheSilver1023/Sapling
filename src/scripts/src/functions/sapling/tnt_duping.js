import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Event from 'stickycore/event'
import World from 'stickycore/world'

Event.afterTrack('entitySpawn', (ev) => {
	if (!Dynamic.getData('tntDuping')) return;
	else if (ev.entity.typeId != 'minecraft:tnt') return;
	
	const { dimension, location } = ev.entity;
	const block = dimension.getBlock(location);
	const sides = ['north', 'south', 'east', 'west', 'up']
		.map((side) => block.step(side).typeId);
	
	if (!sides.includes('minecraft:noteblock')) return;
	
	block.setType('minecraft:tnt');
	ev.entity.runCommand('tp ~~-1~');
});

Event.afterTrack('entitySpawn', (ev) => {
	if (!Dynamic.getData('tntDispenserRefill')) return;
	else if (ev.entity.typeId != 'minecraft:tnt') return;
	
	const { dimension, location } = ev.entity;
	const _b = dimension.getBlock(location);
	const blocks = ['north', 'south', 'east', 'west', 'up']
		.map(side => _b.step(side))
		.filter(b => b.typeId == 'minecraft:dispenser');
		
	blocks.forEach((b) => {
		const inv = b.getComponent('inventory').container;
		const item = new mc.ItemStack('minecraft:tnt', 1);
		inv.addItem(item);
	});
});