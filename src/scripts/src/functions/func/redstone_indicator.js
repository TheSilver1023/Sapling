import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Particle from 'src/lib/particle'

mc.system.runInterval(() => {
	// Dynamic properties 
	if (!Dynamic.getData('redstoneIndicator')) return;
	// Feature
	const PLAYERS = mc.world.getAllPlayers();
	let REDSTONE_KEYS = new Map();
	
	for (let player of PLAYERS) {
		let block = player.getBlockFromViewDirection({ maxDistance: 10 });
		if (!block) continue;
		block = block.block;
		
		const BLOCKS = getCoords(block.location, 2)
			.map(loc => getBlock(loc, block))
			.filter(_ => _.typeId == 'minecraft:redstone_wire');
			
		BLOCKS.forEach((dust) => {
			const { x, y, z } = dust.location;
			const ss = dust.permutation.getState('redstone_signal');
			
			Particle.create(player, `sa:ss_${ss}`, new mc.Vector(x, y + 0.04, z));
		});
	}
});


function rkey (dim, loc) {
	return `${dim.id.replace('minecraft:','')}/${loc.x}/${loc.y}/${loc.z}`;
}

function getBlock (loc, block) {
	return block.dimension.getBlock(loc);
}

function getCoords(center, range) {
	const coordinates = [];
	
	for (let x = -range; x <= range; x++) {
		for (let y = -range; y <= range; y++) {
			for (let z = -range; z <= range; z++) {
				coordinates.push({
					x: center.x + x,
					y: center.y + y,
					z: center.z + z,
				});
			}
		}
	}
	
	return coordinates;
}