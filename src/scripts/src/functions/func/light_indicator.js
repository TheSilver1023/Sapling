import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'

const LIGHTS = new Map();
LIGHTS.set('ll_0', [ 0, 0 ]);
LIGHTS.set('ll_1', [ 64, 0 ]);
LIGHTS.set('ll_2', [ 128, 0 ]);
LIGHTS.set('ll_3', [ 192, 0 ]);
LIGHTS.set('ll_4', [ 0, 64 ]);
LIGHTS.set('ll_5', [ 64, 64 ]);
LIGHTS.set('ll_6', [ 128, 64 ]);
LIGHTS.set('ll_7', [ 192, 64 ]);
LIGHTS.set('ll_8', [ 0, 128 ]);
LIGHTS.set('ll_9', [ 64, 128 ]);
LIGHTS.set('ll_10', [ 128, 128 ]);
LIGHTS.set('ll_11', [ 192, 128 ]);
LIGHTS.set('ll_12', [ 0, 192 ]);
LIGHTS.set('ll_13', [ 64, 192 ]);
LIGHTS.set('ll_14', [ 128, 192 ]);
LIGHTS.set('ll_15', [ 192, 192 ]);

mc.system.runInterval(() => {
	// Dynamic properties
	if (!Dynamic.getData('lightIndicator')) return;
	// Feature
	const PLAYERS = mc.world.getAllPlayers();
	
	for (let player of PLAYERS) {
		try {
			let block = player.getBlockFromViewDirection({ maxDistance: 10 });
			const item = player.getComponent('inventory').container.getSlot(player.selectedSlot);
			
			if (!block || !item || item.typeId != 'minecraft:clock') continue;
			block = block.block;
			
			const { x, y, z } = block.location;
			const lvec = new mc.Vector(x, y+1, z);		
			const entity = block.dimension.spawnEntity('sa:light_level', lvec);
			
			mc.system.runTimeout(() => {
				const light_level = entity.getProperty('sa:light');
				entity.remove();
				
				const [ ux, uz ] = LIGHTS.get(`ll_${light_level}`);
				const [ r, g, b ] = [
					light_level > 7 ? 0 : 0.6,
					light_level > 7 ? 0.6 : 0,
					0
				];
				
				const vm = new mc.MolangVariableMap()
					vm.setFloat('x', ux);
					vm.setFloat('z', uz);
					vm.setFloat('r', r);
					vm.setFloat('g', g);
					vm.setFloat('b', b);
				
				block.dimension.spawnParticle('sa:light_level', new mc.Vector(x+0.5, y+1.04, z+0.5), vm);
			}, 2);
		} catch {}
	}
}, 4)