import * as mc from '@minecraft/server'
import Dims from './src/dimensions'
import Entity from './builder/_entity'

class World {
	// Private Properties
	static #dimension = mc.world.getDimension('overworld');
	
	// Cloned Methods
	static sendMessage = (message) => mc.world.sendMessage(message);
	static setAbsoluteTime = (absoluteTime) => mc.world.setAbsoluteTime(absoluteTime);
	static setTimeOfDay = (timeOfDay) => mc.world.setTimeOfDay(timeOfDay);
	static setWeather = (weatherType, duration) => {
		mc.system.run(this.#dimension.setWeather(weatherType, duration))
	}
	static runCommand(command) => this.#dimension.runCommand(command);
	
	// Get Entities
	static getPlayers(options = { dimension: 'any' }) {
		const { dimension, ...filteredOptions } = options;
		
		if (Dims[dimension]) {
			const allPlayers = mc.world.getAllPlayers().map(_ => new Entity(_));
			
			if (dimension === 'any') return allPlayers;
			
			const dimensionId = Dims[dimension];
			const filteredPlayers = Object.keys(filteredOptions).length === 0 
				? allPlayers.filter(player => player.dimension.id === dimensionId)
				: mc.world.getPlayers(filteredOptions).filter(player => player.dimension.id === dimensionId);
			
			return filteredPlayers.map(_ => new Entity(_));
		} else {
			throw new Error('Invalid dimension');
		}
	}
	
	static getEntities(options = { dimension: 'any' }) {
		const { dimension, ...filteredOptions } = options;
		
		if (Dims[dimension]) {
			const _dimension = mc.world.getDimension(dimension == 'any' ? 'overworld' : dimension);
			const allEntities = _dimension.getEntities();
			
			if (dimension === 'any') return allEntities.map(_ => new Entity(_));
			
			const dimensionId = Dims[dimension];
			const filteredEntities = Object.keys(filteredOptions).length === 0
				? allEntities.filter(entity => entity.dimension.id === dimensionId)
				: _dimension.getEntities(filteredOptions).filter(entity => entity.dimension.id === dimensionId);
			
			return filteredEntities.map(_ => new Entity(_));
		} else {
			throw new Error('Invalid dimension');
		}
	}
}


export default World;