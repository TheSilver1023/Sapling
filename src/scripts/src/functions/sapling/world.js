import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'
import Event from 'stickycore/event'
import World from 'stickycore/world'

const MOBS = [
	'minecraft:zombie',
	'minecraft:skeleton',
	'minecraft:stray',
	'minecraft:enderman'
];
	
Event.afterTrack('entityDie', (ev) => {
	if (!Dynamic.getData('renewableSoulSand')) return;
	else if (!['fireTick','fire'].includes(ev.damageSource.cause)) return;
	else if (!MOBS.includes(ev.deadEntity.typeId)) return;
	
	ev.deadEntity.runCommandAsync('execute if block ~~-1~ sand run setblock ~~-1~ soul_sand [] replace');
}, { parser: false });

let TICK = 0;
mc.system.runInterval(() => {
	TICK++;
	// Dynamic properties 
	const endPortalGBD = Dynamic.getData('endPortalGBD');
	const pigmanFarmWarts = Dynamic.getData('pigmanFarmWarts');
	const ravagerDestroyCherryLeaves = Dynamic.getData('ravagerDestroyCherryLeaves');
	const entityCramming = Dynamic.getData('entityCramming');
	// Features
	const ov = mc.world.getDimension('overworld');
	
	if (endPortalGBD) {
		const cmd = 'execute at @e[type=falling_block] if block ~~-2~ end_portal run clone ~~~ ~~~ ~~1~ replace normal';
		ov.runCommand(cmd)
	}
	
	if (pigmanFarmWarts) {
		const cmd = 'execute at @e[type=zombie_pigman] if block ~~1~ nether_wart ["age": 3] run setblock ~~1~ nether_wart destroy';
		ov.runCommand(cmd)
	}
	
	if (ravagerDestroyCherryLeaves) {
		const over = mc.world.getDimension('overworld');
		const ravagers = over.getEntities({ type: 'minecraft:ravager' });
		for (let _r of ravagers) {
			const { location, dimension } = _r;
			let x = location.x - 1;
			let y = location.y;
			let z = location.z - 1;
			
			for (let i=0; i<3; i++) {
				for (let j=0; j<3; j++) {
					for (let k=0; k<3; k++) {
						replaceBlock(x+j, y+i, z+k, dimension);
					}
				}
			}
		}
	}
	
	if (entityCramming && TICK >= 5) {
		TICK = 0;
		ov.runCommand('scoreboard players reset * SaplingDG');
		ov.runCommand('execute at @e[type=!item,type=!xp_orb,type=!minecart] run scoreboard players add @e[r=1,type=!item,type=!xp_orb,type=!minecart] SaplingDG 1');
		ov.runCommand('damage @e[scores={SaplingDG=24..100000000}] 6 contact');
	}
}, 2);


function replaceBlock(x, y, z, d) {
	let loc = new mc.Vector(x, y, z);
	let b = d.getBlock(loc);
	if (b.typeId == 'minecraft:cherry_leaves') {
		b.setType('minecraft:air');
	}
}


let DATA = new Map();
let WORLD_GT = 0;


mc.system.runInterval(() => {
	if (!Dynamic.getData('blockSplit')) return WORLD_GT = 0;
	WORLD_GT++;
}, 1);
	
Event.afterTrack('pistonActivate', (ev) => {
	if (!Dynamic.getData('blockSplit')) return;
	const { x, y, z } = ev.piston;
	// Event
	const key = `${x} ${y} ${z}`;
	if (ev.isExpanding) {
		let hasBlocks = ev.piston.getAttachedBlocks().length;
		DATA.set(key, {
			tick: WORLD_GT,
			hasBlocks
		});
		return;
	}
	
	if (!DATA.has(key)) return;
	
	const { tick, hasBlocks } = DATA.get(key);
	let tickDifference = WORLD_GT - tick;
	if (tickDifference <= 4 && hasBlocks) {
		const p = ev.piston.block.permutation.clone();
		ev.block.setType('minecraft:sticky_piston');
		ev.piston.block.setPermutation(p);
	}
	
	DATA.delete(key);
});