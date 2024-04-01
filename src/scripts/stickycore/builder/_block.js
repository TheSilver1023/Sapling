import Dimension from './_dimension'

class Block {
	#instance;
	#permutation;
	constructor(block) {
		this.#instance = block;
		this.#permutation = block.permutation
		const { isAir, isLiquid, isSolid, isWaterlogged, } = block;
		const redstonePower = block.getRedstonePower();
		const isValid = block.isValid();
		// Properties 
		this.location = block.location;
		this.dimension = new Dimension(block.dimension);
		this.typeId = block.typeId;
		this.type = block.type;
		this.data = { isAir, isLiquid, isSolid, isWaterlogged, isValid };
		if (redstonePower) this.data['redstonePower'] = redstonePower;
	}
	
	getStates() {
		const directions = ['down','up','south','north','east','west'];
		const _st = this.#permutation.getAllStates();
		let states = {};
		
		for (let _ in _st) {
			let d = _st[_];
			if (_ == 'facing_direction') states['minecraft:facing_direction'] = directions[d];
			else if (_ == 'minecraft:cardinal_direction') states['minecraft:facing_direction'] = d;
			else if (!_.startsWith('minecraft:')) states['minecraft:' + _] = d;
			else states[_] = d;
		}
		
		return states;
	}
	
	getComponent(componentId) {
		return this.#instance.getComponent(componentId);
	}
	
	getItemStack(amount = 1, withData = false) {
		return this.#instance.getItemStack(amount, withData);
	}
	
	getTags() {
		return this.#instance.getTags();
	}
	
	hasTag(tag) {
		return this.#instance.hasTag(tag);
	}
	
	setType(blockType) {
		this.#instance.setType(blockType)
	}
	
	step(location, steps = 1) {
		const _c = {
			north: 'north',
			south: 'south',
			east: 'east',
			west: 'west',
			down: 'below',
			up: 'above'
		}
		
		if (!_c[location]) throw new Error('Invalid location');

		const pl = _c[location];
		return new Block(this.#instance[pl](steps));
	}
}

export default Block;