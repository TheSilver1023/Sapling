import * as mc from '@minecraft/server'
import DimensionBuilder from './builder/_dimension'

class Dimension {
	// Private properties 
	static #overworld = mc.world.getDimension('overworld');
	static #nether = mc.world.getDimension('nether');
	static #the_end = mc.world.getDimension('overworld');

	// Dimensions
	static overworld = new DimensionBuilder(this.#overworld);
	static nether = new DimensionBuilder(this.#nether);
	static the_end = new DimensionBuilder(this.#the_end);
}

export default Dimension;