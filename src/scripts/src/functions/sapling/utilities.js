import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Event from 'stickycore/event'

const LIGHT_BLOCKS = {
	'minecraft:torch': 14,
	'minecraft:soul_torch': 10,
	'minecraft:redstone_torch': 7,
	'minecraft:glowstone': 15,
	'minecraft:lantern': 15,
	'minecraft:soul_lantern': 10,
	'minecraft:campfire': 15,
	'minecraft:soul_campfire': 10,
	'minecraft:lit_pumpkin': 15,
	'minecraft:sea_lantern': 15,
	'minecraft:sea_pickle': 6
};

let TICK = 0;
mc.system.runInterval(() => {
	// Dynamic properties
	const dynamicLight = Dynamic.getData('dynamicLight');
	// Features
	const players = mc.world.getAllPlayers();
	players.forEach(player => {
		const { container } = player.getComponent('inventory');
		const item = container.getItem(player.selectedSlot);
		const light = item ? LIGHT_BLOCKS[item.typeId] : 0;
	
		if (light > 0 && dynamicLight) {
			player.runCommand(`fill ~~~ ~~1~ light_block["block_light_level": ${light}] replace air`);
		}
		
		if (TICK >= 20) {
			player.runCommand('fill ~-6 ~-6 ~6 ~6 ~6 ~-6 air replace light_block');
			TICK = 0;
		}
	});
	TICK++;
});