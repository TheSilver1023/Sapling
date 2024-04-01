import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Event from 'stickycore/event'

const DIRECTIONS =  {
	Up: 'above',
	Down: 'below',
	North: 'north',
	South: 'south',
	East: 'east',
	West: 'west'
};

const PLACE_DIRECTIONS = {
	North: 2,
	South: 3,
	East: 5,
	West: 4
}

		
Event.beforeTrack('itemUseOn', (ev) => {
	// Dynamic properties
	const cauldronBedrockBreaker = Dynamic.getData('cauldronBedrockBreaker');
	const signBedrockBreaker= Dynamic.getData('signBedrockBreaker');
	// Features
	const { itemStack, source, block, blockFace } = ev;
	
	if (cauldronBedrockBreaker) {
		const liquid = block.permutation.getState('cauldron_liquid');
		if (itemStack.typeId != 'minecraft:powder_snow_bucket') return;
		else if (block.typeId != 'minecraft:cauldron') return;
		else if (liquid != 'powder_snow') return;
		
		const { x, y, z } = block.location;
		let b = block.dimension.getBlock(new mc.Vector(x,y+1,z));
		mc.system.run(() => {
			b.setType('powder_snow');
		});
	}
	
	if (signBedrockBreaker) {
		const id = itemStack.typeId;
		const isSign = id.includes('sign') && !id.includes('hand');
		const validBlock = block.typeId.includes('sign');
		if (!isSign || !validBlock) return;
		
		const face = DIRECTIONS[blockFace];
		const _b = block[face](1);
		if (!source.isSneaking) return;
		
		const inv = source.getComponent('inventory').container;
		ev.cancel = true;
		mc.system.run(() => {
			_b.setType('minecraft:air');
			placeSign(itemStack.typeId, _b, blockFace);
			removeSign(inv, source.selectedSlot, itemStack);
		});
	}
}, { parser: false });

function placeSign(id, block, face) {
	const { x, y, z } = block.location;
	const place = PLACE_DIRECTIONS[face];
	const signType = id.includes('oak') 
		? 'wall_sign'
		: id.replace('_', '_wall_');
	
	const cmd = `setblock ${x} ${y} ${z} ${signType} ["facing_direction": ${place}]`;
	block.dimension.runCommand(cmd);
}

function removeSign(inv, slot) {
	const item = inv.getItem(slot);
	const amount = item.amount - 1;
	
	const newItem = new mc.ItemStack(amount > 0 ? item.typeId : 'minecraft:air', amount > 0 ? amount : 1);
	inv.setItem(slot, newItem);
}	

Event.afterTrack('entitySpawn', async (ev) => {
	if (!Dynamic.getData('anvilBedrockBreaker')) return;
	else if (ev.entity.typeId != 'minecraft:falling_block') return;
	
	const { location, dimension } = ev.entity
		const loc = {
			x: Math.floor(location.x),
			y: Math.floor(location.y),
			z: Math.floor(location.z)
		}
		
		await sleep(700);
		
		const b = dimension.getBlock(loc);
		if (b.typeId != 'minecraft:anvil') return;
		
		if (getBlock(b,[1,-1,0]).typeId.includes('arm_collision')) mc.system.run(() => getBlock(b,[1,-2,0]).setType('minecraft:air'))
		if (getBlock(b,[-1,-1,0]).typeId.includes('arm_collision')) mc.system.run(() => getBlock(b,[-1,-2,0]).setType('minecraft:air'))
		if (getBlock(b,[0,-1,1]).typeId.includes('arm_collision')) mc.system.run(() => getBlock(b,[0,-2,1]).setType('minecraft:air'))
		if (getBlock(b,[0,-1,-1]).typeId.includes('arm_collision')) mc.system.run(() => getBlock(b,[0,-2,-1]).setType('minecraft:air'))
}, { parser: false });

function getBlock(base, coords) {
	let locB = {
		x: base.location.x + coords[0],
		y: base.location.y + coords[1],
		z: base.location.z + coords[2]
	};
	return base.dimension.getBlock(locB);
}

function sleep (ms) {
	return new Promise(res => mc.system.runTimeout(res,ms/50));
}