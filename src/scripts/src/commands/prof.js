import * as mc from '@minecraft/server'
import Command from 'stickycore/command'
import World from 'stickycore/world'
import Data from 'stickycore/data'
import Lang from 'src/config/langs'

new Command()
	.setName('prof')
	.setCallback(ProfCommand)
	.build();

function ProfCommand (sender) {
	Lang('prof');
	
	const overworld = mc.world.getDimension('overworld');
	
	const DATA = {
		tps: 20,
		lastTick: Date.now(),
		timeArray: [],
		entities: 0,
		chunks: 0
	}
			
	const runTime = mc.system.runInterval(() => {
		if (DATA.timeArray.length == 20) { 
			DATA.timeArray.shift();
		}
		
		DATA.timeArray.push(Math.round(1000 / (Date.now() - DATA.lastTick) * 100) / 100);
		DATA.tps = DATA.timeArray.reduce((a,b) => a + b) / DATA.timeArray.length;
		DATA.lastTick = Date.now();
	});
			
	mc.system.runTimeout(() => {
		mc.system.clearRun(runTime);

		DATA.chunks = getChunks();
		
		DATA.tps = Math.floor(DATA.tps);
		for (let x of overworld.getEntities()) {
			if (x.typeId.startsWith('sa:')) continue;
			DATA.entities++;
		}
		
		const DataText = ''
			+ `TPS: §r§${DATA.tps < 20 ? 'c' : 'a'}${parseInt(DATA.tps)}§r `
			+ `Entities: §s${DATA.entities}§r\n`
			+ `Chunks: §r§i${DATA.chunks}§r`
		
		World.sendMessage(DataText);
	}, 100);
}

function getChunks() {
	const PLAYERS = mc.world.getAllPlayers();
	const Keys = [];
	let Chunks = 0;
	
	PLAYERS.forEach((player) => {
		const { x, y, z } = player.location;
		const { id } = player.dimension;
		const rx = x + 192;
		const rz = z + 192;
		
		for (let lx = rx; lx > -rx; lx -= 16) {
			for (let lz = rz; lz > -rz; lz -= 16) {
				const c = new Data.Chunk(lx, lz);
				const key = `${id}/${c.worldX}/${c.worldZ}`
				
				if (Keys.includes(key)) continue;
				try {
					const cl = new mc.Vector(c.center.x, y, c.center.z);
					const ce = player.dimension.spawnEntity('sa:chunk', cl);
					
					Chunks++;
					ce.remove()
					Keys.push(key)
				} catch {}
			}
		}
	});
	
	return Chunks;
}