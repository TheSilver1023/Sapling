import * as mc from '@minecraft/server'
import Dimension from './_dimension'
import Block from './_block'

class _Entity {
	#instance;
	
	constructor(entity, options = { createTarget: true }) {
		if (!entity) return undefined;
		this.#instance = entity;
		for (let _ of Object.keys(entity)) {
			this[_] = entity[_];
		}
		
		// Properties
		//this.dimension = new Dimension(entity.dimension);
		//this.id = entity.id;
		//this.location = entity.location;
	}
	
	getBlockFromViewDirection(options = {}) {
		const _b = this.#instance.getBlockFromViewDirection(options);
		return new Block(_b)
	}
	
	getEntitiesFromViewDirection(optioms = {}) {
		const _ue = this.#instance.getEntitiesFromViewDirection(options);
		return _ue.map(_ => new _Entity(_));
	}
	
	runCommand(command) {
		return this.#instance.runCommand(command);
	}
}

export default _Entity;