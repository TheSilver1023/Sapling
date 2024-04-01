import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Data from 'stickycore/data'
import Cameras from '../static/free_camera'

const DATA = {
	tps: 20,
	lastTick: Date.now(),
	timeArray: [],
	entities: 0,
	slimes: new Map()
}

mc.system.runInterval(() => {
	// Dynamic propertie
	if (!Dynamic.getData('infoDisplay')) return;
	// Feature
	const Players = mc.world.getAllPlayers();
	
	for (let p of Players) {
		const { x, y, z } = p.location;
		const c = new Data.Chunk(x, z);
		let InfoTxt = '';
		
		// Values
		DATA.tps = Math.round(DATA.tps);
		
		const TPS = DATA.tps >= 20 ? `§a20` : `§c${DATA.tps}`;
		const Entities = p.dimension.getEntities().filter(_ => !_.typeId.includes('sa:'))
		const [ _x, _y, _z ] = [ Math.floor(x), Math.floor(y), Math.floor(z) ];
		const [ cx, cz ] = [ c.worldX, c.worldZ ];
		const [ rx, rz ] = [ (_x + 16) % 16, (_z + 16) % 16 ];
		const ck = `${cx}/${cz}`
		
		if (!DATA.slimes.has(ck)) {
			if (c.isSlime()) DATA.slimes.set(ck, '§atrue');
			else DATA.slimes.set(ck, '§cfalse');
		}
		
		// Set Values
		InfoTxt += `TPS: ${TPS}§r Entities: §7${Entities.length}§r  \n`
		InfoTxt += `XYZ: §7${_x} ${_y} ${_z}§r\n`
		InfoTxt += `Chunk: §7[${c.worldX}, ${c.worldZ}] to [${rx}, ${rz}]§r\n`
		InfoTxt += `Slime Chunk: ${DATA.slimes.get(ck)}§r\n`
		
		if (p.hasTag('free_camera') && Cameras.has(p.name)) {
			const cp = Cameras.get(p.name);
			InfoTxt += `Camera: §7${cp.x.toFixed()} ${cp.y.toFixed()} ${cp.z.toFixed()}`
		}
		
		p.onScreenDisplay.setActionBar(InfoTxt.trim());
	}
	
	// TPS
	if (DATA.timeArray.length == 20) DATA.timeArray.shift();
	DATA.timeArray.push(Math.round(1000 / (Date.now() - DATA.lastTick) * 100) / 100);
	DATA.tps = DATA.timeArray.reduce((a,b) => a + b) / DATA.timeArray.length;
	DATA.lastTick = Date.now();
});