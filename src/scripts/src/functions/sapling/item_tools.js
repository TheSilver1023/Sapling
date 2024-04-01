import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Event from 'stickycore/event'

const TOOL_TYPES = {
	// Shovel tags
	dirt: '_shovel',
	sand: '_shovel',
	gravel: '_shovel',
	// Pickaxe tags
	stone: '_pickaxe',
	metal: '_pickaxe',
	diamond_pick_diggable: '_pickaxe',
	// Axe tags
	wood: '_axe'
}

Event.afterTrack('entityHitBlock', (ev) => {
	// Dynamic properties
	const toolChanger = Dynamic.getData('toolChanger');
	const instamineObsidian = Dynamic.getData('instamineObsidian');
	const instamineDeepslate = Dynamic.getData('instamineDeepslate');
	// Festures
	const { damagingEntity, hitBlock } = ev;
	
	// dirt, metal, sand, gravel, stone, wood
	if (toolChanger) {
		const tags = hitBlock.getTags();
		const { container } = damagingEntity.getComponent('inventory');
		let tool;
		tags.forEach(_ => tool = TOOL_TYPES[_]);
		
		try {
			if (tool) {
				for (let x = 0; x < 9; x++) {
					const item = container.getItem(x);
					if (!item) continue;
					if (item.typeId.includes(tool)) {
						damagingEntity.selectedSlot = x;
					}
				}
			}
		} catch {}
	}
	
	if (instamineObsidian) {
		const pickaxes = ['minecraft:diamond_pickaxe', 'minecraft:netherite_pickaxe'];
		const item = damagingEntity.getComponent('inventory')
			.container.getItem(damagingEntity.selectedSlot);
		if (item && pickaxes.includes(item.typeId)) {
			if (hitBlock.typeId == 'minecraft:obsidian') {
				damagingEntity.addEffect('haste', 1, { amplifier: 128 });
			}
		};
	}
	
	if (instamineDeepslate) {
		const pickaxes = ['minecraft:diamond_pickaxe', 'minecraft:netherite_pickaxe'];
		const item = damagingEntity.getComponent('inventory')
			.container.getItem(damagingEntity.selectedSlot);
		if (item && pickaxes.includes(item.typeId)) {
			if (hitBlock.typeId.includes('deepslate')) {
				damagingEntity.addEffect('haste', 1, { amplifier: 128 });
			}
		};
	}
}, { parser: false });

function toolChanger(player, tool) {
	try {
		const inv = player.getComponent('inventory').container;
		for (let x = 0; x < 9; x++) {
			const item = inv.getItem(x);
			if (!item) continue;
			if (item.typeId.includes(tool)) return player.selectedSlot = x;
		}
	} catch (e) {
		console.warn(e)
	}
}


Event.beforeTrack('playerBreakBlock', (ev) => {
	// Dynamic properties 
	const silkTouchGetSpawners = Dynamic.getData('silkTouchGetSpawners');
	const silkTouchGetBuddingAmethyst = Dynamic.getData('silkTouchGetBuddingAmethyst');
	// Features 
	const { itemStack, block } = ev;
	if (!itemStack || !itemStack.typeId.endsWith('_pickaxe')) return;
	
	const enchants = itemStack.getComponent('minecraft:enchantable');
	if (enchants.hasEnchantment('silk_touch') == 0) return;

	if (silkTouchGetSpawners && block.typeId == 'minecraft:mob_spawner') {
		ev.cancel = true;
		mc.system.run(() => {
			block.dimension.spawnItem(block.getItemStack(1, true), block.location);
			block.setType('minecraft:air')
		});
	};
		
	if (silkTouchGetBuddingAmethyst && block.typeId == 'minecraft:budding_amethyst') {
		mc.system.run(() => {
			let drop = new mc.ItemStack('minecraft:budding_amethyst', 1);
			block.dimension.spawnItem(drop, block.location);
		});
	};
}, { parser: false });