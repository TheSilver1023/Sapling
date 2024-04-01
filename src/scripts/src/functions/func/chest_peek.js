import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'

mc.system.runInterval(() => {
	if (!Dynamic.getData('chestPeek')) return;
	// Feature
	const PLAYERS = mc.world.getAllPlayers();
	for (let player of PLAYERS) {
		let block = player.getBlockFromViewDirection({ maxDistance: 12 });
		if (!block) continue;
		
		block = block.block;
		
		let inv = block.getComponent('inventory');
		const items = {};
		
		if (!inv) continue;
		inv = inv.container;
		
		for (let i=0; i<inv.size; i++) {
			try {
				const item = inv.getSlot(i);
				
				let data = item.typeId.replace('minecraft:','');
				if (items[data]) items[data] += item.amount;
				else items[data] = item.amount;
			} catch {}
		}
		
		// Return values
		let bId = block.typeId.replace('minecraft:','');
		bId = bId.replace('shulker_box','sb')
		bId = bId.split('_').join(' ');
				
		const { x, y, z } = block;
		let txt = `§l§b${bId}: §r§b[${x}, ${y}, ${z}]`
		for (let i in items) txt += `\n§r${i}: §c${items[i]}`;
				
		player.onScreenDisplay.setTitle(txt.trim())
	}
});