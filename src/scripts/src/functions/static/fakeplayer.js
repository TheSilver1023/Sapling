import * as gt from '@minecraft/server-gametest'
import * as mc from '@minecraft/server'
import { module } from 'stickycore/dynamic'
import MyDB from 'stickycore/mapDB'
import PlayerBuilder, { PlayersDB } from 'src/lib/fakeplayer'

let init = false;

gt.register('sapling', 'fakeplayer', (test) => {
	module({ gametest: test });
	
	if (init) return;
	const World_FP = new MyDB('World_Fakeplayers');
	
	World_FP.forEach((username, data) => {
		const [ _dim, _x, _y, _z ] = data.split('/');
		const [ x, y, z ] = [ _x, _y, _z ].map(_ => parseInt(_));
		const dim = mc.world.getDimension(_dim);
		
		let FP = new PlayerBuilder(username, { x, y, z }, test);
		FP.actions = [];
		
		PlayersDB.set(username, FP);
		FP.teleport({ x, y, z }, dim);
	});
	init = true;
})
	.structureName('piston:up')
	.maxTicks(0x7FFFFFFF)
	.maxAttempts(256);
	
mc.world.getDimension('overworld').runCommand('execute positioned 999999999 100 999999999 run gametest run sapling:fakeplayer');