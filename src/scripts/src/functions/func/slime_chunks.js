import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import World from 'stickycore/world'
import Data from 'stickycore/data'
import Particle from 'src/lib/particle'

mc.system.runInterval(() => {
	const slimeChunks = Dynamic.getData('slimeChunks');
	const chunksDB = new Map();
	const players = mc.world.getAllPlayers();

	/* get & set keys */
	players.forEach(user => {
		const { dimension } = user;
		if (dimension.id == 'minecraft:overworld' && !slimeChunks) return;
		const { x, z } = user.getHeadLocation();
		const m = new Data.Chunk(x, z);
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				const c = new Data.Chunk(
					m.minX + (15 * j),
					z - (15 * i)
				);
				if (!c.isSlime()) continue;
				let k = ckey(dimension, c);
				if (chunksDB.has(k)) continue;
				else chunksDB.set(k, c);
			}
			for (let j = 0; j < 10; j++) {
				const c = new Data.Chunk(
					m.minX - (15 * j),
					z - (15 * i)
				);
				if (!c.isSlime()) continue;
				let k = ckey(dimension, c);
				if (chunksDB.has(k)) continue;
				else chunksDB.set(k, c);
			}
		}
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				const c = new Data.Chunk(
					m.minX + (15 * j),
					z + (15 * i)
				);
				if (!c.isSlime()) continue;
				let k = ckey(dimension, c);
				if (chunksDB.has(k)) continue;
				else chunksDB.set(k, c);
			}
			for (let j = 0; j < 10; j++) {
				const c = new Data.Chunk(
					m.minX + (15 * j),
					z - (15 * i)
				);
				if (!c.isSlime()) continue;
				let k = ckey(dimension, c);
				if (chunksDB.has(k)) continue;
				else chunksDB.set(k, c);
			}
		}
	});

	/* create particles */
	const pt = {
		'overworld': ['sa:slime_x', 'sa:slime_z'],
	}
	try {
		chunksDB.forEach((c, key) => {
			let [dim] = key.split('/');
			let [side1, side2] = pt[dim];
			Particle.dimension(dim, side1, new mc.Vector(c.minX-0.1, 0, c.minZ+7.98));
			Particle.dimension(dim, side1, new mc.Vector(c.maxX+0.98, 0, c.maxZ-6.98));
			Particle.dimension(dim, side2, new mc.Vector(c.minX+7.98, 0, c.minZ-0.001));
			Particle.dimension(dim, side2, new mc.Vector(c.minX+7.98, 0, c.minZ+15.98));
			chunksDB.delete(key);
		});
	} catch {}
}, 20);

function ckey (dim, loc) {
	return `${dim.id.replace('minecraft:', '')}/${loc.minX}/${loc.minZ}`;
};