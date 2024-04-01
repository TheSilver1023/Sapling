import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Event from 'stickycore/event'

const TNT_BLOCKS = new Map();


Event.beforeTrack('explosion', (ev) => {
	// Dynamic properties
	const tntNotExplodes = Dynamic.getData('tntNotExplodes');
	const tntNoDrops = Dynamic.getData('tntNoDrops');
	const tntDropAllBlocks = Dynamic.getData('tntDropAllBlocks');
	const tntDropIce = Dynamic.getData('tntDropIce');
	const tntBlocks = Dynamic.getData('tntBlocks');
	// Blocks
	const BLOCKS = ev.getImpactedBlocks();
	let blocks = ev.getImpactedBlocks()
		.map(_ => ev.dimension.getBlock(_));
	// Features 
	if (tntNotExplodes) return ev.cancel = true;
	else if (tntNoDrops) {
		for (let b of blocks) {
			mc.system.run(() => {
				b.setType('minecraft:air');
			});
		}
		ev.setImpactedBlocks([]);
		blocks = [];
	}
	
	if (tntBlocks) {
		const DIM = ev.dimension;
	
		for (let loc of BLOCKS) {
			const { x, y, z } = loc;
			mc.system.run(() => {
				DIM.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:block_x ~0.5 ~0.5 ~`);
				DIM.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:block_x ~-0.5 ~0.5 ~`);
				DIM.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:block_y ~ ~ ~`);
				DIM.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:block_y ~ ~1 ~`);
				DIM.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:block_z ~ ~0.5 ~0.5`);
				DIM.runCommand(`execute positioned ${x} ${y} ${z} run particle sa:block_z ~ ~0.5 ~-0.5`);
			});
		}
	}
	
	if (tntDropAllBlocks && tntDropIce) {
		for (let block of blocks) {
			let key = createKey(block);
			if (TNT_BLOCKS.has(key)) continue;
			else TNT_BLOCKS.set(key, block);
		};
			
		ev.setImpactedBlocks([]);
	} else if (tntDropAllBlocks) {
		let tnt = [];
		
		for (let block of blocks) {
			const isIce = block.typeId.includes('ice');
			
			
			if (!isIce) {
				let key = createKey(block);
				if (TNT_BLOCKS.has(key)) continue;
				else TNT_BLOCKS.set(key, block);
			} else tnt.push(block);
		};
		
		ev.setImpactedBlocks(tnt);
	} else if (tntDropIce) {
		let tnt = [];
		
		for (let block of blocks) {
			const isIce = block.typeId.includes('ice');
			
			
			if (isIce) {
				let key = createKey(block);
				if (TNT_BLOCKS.has(key)) continue;
				else TNT_BLOCKS.set(key, block);
			} else tnt.push(block);
		};
		
		ev.setImpactedBlocks(tnt);
	} 
}, { parser: false });


mc.system.runInterval(() => {
	if (TNT_BLOCKS.size == 0) return;
	TNT_BLOCKS.forEach(function(b, key) {
		const block = TNT_BLOCKS.get(key);
		
		const { typeId, location, dimension } = block;
		const { x, y, z } = location;
		const dim = dimension.id.replace('minecraft:', '');
		
		try {
			if (typeId == 'minecraft:tnt') {
				dimension.runCommand(`execute in ${dim} run summon tnt ${x} ${y} ${z}`);
			} else {
				let item = new mc.ItemStack(typeId, 1);
				dimension.spawnItem(item, block);
			}
		} catch {}
		
		TNT_BLOCKS.delete(key);
		block.setType('minecraft:air');
	});
});

function createKey(block) {
	const { location, dimension } = block;
	const { x, y, z } = location;
	let dim = dimension.id.replace('minecraft:','');
	// key
	return `${dim}:${x}/${y}/${z}`;
}