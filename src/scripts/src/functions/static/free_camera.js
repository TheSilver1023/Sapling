import * as mc from '@minecraft/server'
import World from 'stickycore/world'

const Cameras = new Map();
mc.system.runInterval(() => {
	// Properties
	const Players = mc.world.getAllPlayers()
	// Features
	Players.forEach((player) => {
		const user = player.name;
		
		if (!player.hasTag('free_camera')) {
			if (Cameras.has(user)) Cameras.delete(user);
			return player.runCommand('camera @s clear')
		}
	
		if (!Cameras.has(user)) {
			player.runCommand(`camera @s set minecraft:free ease 0.1 linear pos ~ ~2 ~-1 facing ^ ^2 ^`)
			Cameras.set(user, player.location)
		} else {
			const vd = player.getViewDirection();
			const cp = Cameras.get(user);
			
			if (player.hasTag('static_camera')) return;
		
			player.runCommand(`execute positioned ${cp.x} ${cp.y} ${cp.z} run camera "${player.name}" set minecraft:free ease 0.1 linear pos ${cp.x} ${cp.y+2} ${cp.z} facing ~${+vd.x*100} ~${+vd.y*100} ~${+vd.z*100}`);
						
			if (!player.isSneaking) return;
			
			const newCp = {
				x: cp.x + vd.x*1.4,
				y: cp.y + vd.y*1.4,
				z: cp.z + vd.z*1.4
			}
			
			Cameras.set(user, newCp);
		}
	});
}, 2); 

export default Cameras;