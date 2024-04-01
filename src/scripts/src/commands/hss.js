import * as mc from '@minecraft/server'
import Command from 'stickycore/command'
import World from 'stickycore/world'
import MyDB from 'stickycore/mapDB'
import Lang from 'src/config/langs'

new Command()
	.setName('hss')
	.addArgument('string', 'option')
	.addArgument('string', 'args')
	.setCallback(HssCommand)
	.build();


function HssCommand(sender, { option, args }) {
	// Config 
	const HsaTypes = { netherfortress: 'NetherFortress', swamphut: 'SwampHut', pillageroutpost: 'PillagerOutpost', oceanmonument: 'OceanMonument' }
	const DimTypes = { nether: 'minecraft:nether', the_end: 'minecraft:the_end', overworld: 'minecraft:overworld' }
	const HSS = { SwampHut: 'SwampHut', NetherFortress: 'NetherFortress', PillagerOutpost: 'PillagerOutpost', OceanMonument: 'OceanMonument' }

	for (let _ in HSS) {
		HSS[_] = new MyDB(_);
	}
	
	const op = option.toLowerCase();
	const [a, b, c, d, e] = args.split(' '); 
	
	switch (op) {
		case 'create': 
			// Data
			const { x, y, z, dm, ht } = {
				x: a != '' ? Number(a) : null,
				y: b != '' ? Number(b) : null,
				z: c != '' ? Number(c) : null,
				dm: DimTypes[d.toLowerCase()],
				ht: HsaTypes[e.toLowerCase()]
			}
			
			// Closures
			if ([x,y,z,dm,ht].includes(null)) return Lang('invalidValue');
			
			// Option
			const data = [x,y,z,dm].join('/');
			const key = genKey();
			
			if (HSS['SwampHut'].values().includes(data)) return World.sendMessage('§eAlready created');
			else if (HSS['NetherFortress'].values().includes(data)) return World.sendMessage('§eAlready created');
			else if (HSS['PillagerOutpost'].values().includes(data)) return World.sendMessage('§eAlready created');
			else if (HSS['OceanMonument'].values().includes(data)) return World.sendMessage('§eAlready created');
			else HSS[ht].set(key, data);
			
			World.sendMessage(`§7${ht} hss §a[${key}]§7 created at §h${data.split('/').join(' ')}`);
			break;
			
		case 'remove': 
			// Closures
			if (!a) return Lang('invalidValue');
			// Option
			if (HSS['SwampHut'].has(a)) {
				HSS['SwampHut'].remove(a);
				World.sendMessage(`§a[${a}]§7 hss deleted`);
			} 
			else if (HSS['NetherFortress'].has(a)) {
				HSS['NetherFortress'].remove(a);
				World.sendMessage(`§a[${a}]§7 hss deleted`);
			}
			else if (HSS['PillagerOutpost'].has(a)) {
				HSS['PillagerOutpost'].remove(a);
				World.sendMessage(`§a[${a}]§7 hss deleted`);
			} 
			else if (HSS['OceanMonument'].has(a)) {
				HSS['OceanMonument'].remove(a);
				World.sendMessage(`§a[${a}]§7 hss deleted`);
			}
			else World.sendMessage(`§7hss §e${a} §7not found`);
			break;
			
		case 'list':
			let txt = '', htl = HsaTypes[a.toLowerCase()];
			
			if (a.toLowerCase() == '--all') {
				for (let x in HSS) {
					for (let h of HSS[x].keys()) {
						txt += `§¶§7  - §e[${h}] §7${HSS[x].get(h).split('/').join(' ')} §s(${x})\n`;
					}
				}
					
				World.sendMessage('§qFake hss list:')
				World.sendMessage(txt.trim());
			} else if (htl) {
				for (let h of HSS[htl].keys()) {
					txt += `§¶§7  - §e[${h}] §7${HSS[htl].get(h).split('/').join(' ')}\n`;
				}
				
				World.sendMessage(`§qFake hss list §l§u[${htl}]:`)
				World.sendMessage(txt.trim());
			} else {
				return Lang('invalidValue');
			}
			
			break;
	}
}

function genKey() {
	const chars = '123456789abcdefg';
	const r = Array(8)
		.fill('')
		.map(_ => chars[Math.floor(Math.random() * chars.length)])
		.join('');
		
	return r;
}