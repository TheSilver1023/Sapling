import * as mc from '@minecraft/server';
import { module } from 'stickycore/dynamic'
import MyDB from 'stickycore/mapDB'
import HSA from 'src/lib/hsa'

let randomTick = Math.floor(Math.random() * 320);
let currentTick = 0;

mc.system.runInterval(() => {
	if (currentTick <= randomTick) currentTick++;
	else {
		hssEngine();
		currentTick = 0;
		randomTick = Math.floor(Math.random() * 320);
	}
}, 1);

function hssEngine() {
	let HSS = module.exports['hss'];
	for (let _type in HSS) {
		const type = HSS[_type];
		let db = new MyDB(type);
		db.forEach((key, data) => {
			try {
				let [x, y, z, d] = data.split('/');
				let hss = new HSA({
					hssId: type,
					location: new mc.Vector(Number(x), Number(y), Number(z)),
					dimension: mc.world.getDimension(d.replace('minecraft:',''))
				});
					
				hss.spawn();
			} catch (e) {
				console.warn(e)
			}
		})
	}
}