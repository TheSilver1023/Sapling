import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'

const ov = mc.world.getDimension('overworld');

mc.system.runInterval(() => {
	// Dynamic properties
	const SpawnSpheres = Dynamic.getData('spawnSpheres');
	if (!SpawnSpheres) return;
	// Feature
	const ArmorStands = ov.getEntities({
		type: 'armor_stand'
	});
	
	ArmorStands.forEach((stand) => {
	});
	
}, 20);