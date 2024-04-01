import * as mc from '@minecraft/server'

const ov = mc.world.getDimension('overworld');

class Particle {
	static create (entity, particle, coords) {
		const { x, y, z } = coords;
		entity.runCommand(`particle ${particle} ${x} ${y} ${z}`);
	}
	
	static dimension (dim, particle, coords) {
		const { x, y, z } = coords;
		ov.runCommand(`execute in ${dim} run particle ${particle} ${x} ${y} ${z}`);
	}
}

export default Particle;