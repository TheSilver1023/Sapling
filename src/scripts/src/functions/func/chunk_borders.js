import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import World from 'stickycore/world'
import Data from 'stickycore/data'
import Particle from 'src/lib/particle'

mc.system.runInterval(() => {
	const chunkBorders = Dynamic.getData('chunkBorders');
	if (!chunkBorders) return;
	
	const players = mc.world.getAllPlayers();
	players.forEach(player => {
		const { x, z } = player.location;
		const cd = new Data.Chunk(x, z);
		const { minX, maxX, minZ, maxZ } = cd;
		
		Particle.create(player, 'sa:chunk_x', new mc.Vector(minX-0.1, 0, minZ+7.98));
		Particle.create(player, 'sa:chunk_x', new mc.Vector(maxX+0.98, 0, maxZ-6.98));
		Particle.create(player, 'sa:chunk_z', new mc.Vector(minX+7.98, 0, minZ-0.001));
		Particle.create(player, 'sa:chunk_z', new mc.Vector(minX+7.98, 0, minZ+15.98));
	});
}, 20)