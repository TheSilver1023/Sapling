import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Particle from 'src/lib/particle'

mc.system.runInterval(() => {
	// Dynamic properties
	if (!Dynamic.getData('tpBoxes')) return;
	// Feature
	const Dim = mc.world.getDimension('overworld');
	const SHULKERS = Dim.getEntities({ type: 'shulker' });
	
	for (let shulker of SHULKERS) {
		const { x, y, z } = shulker.getHeadLocation();
		const a = Math.floor(y);
	
		Particle.create(shulker, 'sa:shulker_y', new mc.Vector(x, a+8.5, z));
		Particle.create(shulker, 'sa:shulker_y', new mc.Vector(x, a-8.5, z));
		Particle.create(shulker, 'sa:shulker_x', new mc.Vector(x+8.49, a, z));
		Particle.create(shulker, 'sa:shulker_x', new mc.Vector(x-8.49, a, z));
		Particle.create(shulker, 'sa:shulker_z', new mc.Vector(x, a, z+8.49));
		Particle.create(shulker, 'sa:shulker_z', new mc.Vector(x, a, z-8.49));
	}
}, 20);