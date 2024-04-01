import Block from './_block'
import Entity from './_entity'

class _Dimension {
	#instance;
	
	constructor(dimension) {
		this.#instance = dimension; 
		// Properties 
		this.id = dimension.id;
		this.heightRange = dimension.heightRange;
	}
	
	getBlock(vector3) {
		const _b = this.#instance.getBlock(vector3);
		return new Block(_b);
	}
	
	fillBlocks(begin, end, block, options = {}) {
		return this.#instance.fillBlocks(begin, end, block, options);
	}
	
	spawnEntity(identifier, location) {
		const _e = this.#instance.spawnEntity(identifier, location);
		return new Entity(_e);
	}
	
	spawnItem(itemStack, location) {
		const _e = this.#instance.spawnItem(itemStack, location);
		return new Entity(_e);
	}
	
	spawnParticle(effectName, location, molangVariables = {}) {
		this.#instance.spawnParticle(effectName, location, molangVariables); 
	}
	
	runCommand(command) {
		return this.#instance.runCommand(command);
	}
}

export default _Dimension;