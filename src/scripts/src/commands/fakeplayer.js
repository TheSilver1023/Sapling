import * as mc from '@minecraft/server'
import { module } from 'stickycore/dynamic'
import Command from 'stickycore/command'
import MyDB from 'stickycore/mapDB'
import PlayerBuilder, { PlayersDB } from 'src/lib/fakeplayer'
import Lang from 'src/config/langs'

new Command()
	.setName('fakeplayer')
	.addArgument('string', 'username')
	.addArgument('string', '_action')
	.setCallback(FakeplayerCommand)
	.build();
	
function FakeplayerCommand(sender, args) {
	// Config
	const GameTest = module.exports['gametest'];
	const Actions = module.exports['fakeplayer'];
	const World_FP = new MyDB('World_Fakeplayers');
	
	// Arguments
	const { username, _action } = args;
	const action = _action.toLowerCase();
	
	if (!Actions[action]) return Lang('invalidValue');

	// Feature
	if (action.startsWith('spawn')) {
		const FP = PlayersDB.get(username);
		if (FP) return Lang('fakeplayerConnected', username)
		
		mc.system.run(() => {
			const player = new PlayerBuilder(username, sender.location, GameTest);
		
			player.teleport(sender.location, sender.dimension);
			player.actions = [];
			
			PlayersDB.set(username, player);
			if (action.endsWith('world')) {
				const d = sender.dimension.id.replace('minecraft:', '');
				const { x, y, z } = sender.location;
				const k = `${d}/${x}/${y}/${z}`
				World_FP.set(username, k);
			}
		});
	} else if (action == 'kill') {
		const FP = PlayersDB.get(username);
		if (!FP) return Lang('fakeplayerInvalid');
		
		mc.system.run(() => {
			FP.disconnect();
			PlayersDB.delete(username);
			
			if (World_FP.has(username)) {
				World_FP.remove(username);
			}
		});
	} else if (action == 'teleport') {
		const FP = PlayersDB.get(username);
		if (!FP) return Lang('fakeplayerInvalid');
		
		mc.system.run(() => {
			FP.teleport(sender.location, sender.dimension);
		});
	} else if (action.includes('repeat:')) {
		const FP = PlayersDB.get(username);
		if (!FP) return Lang('fakeplayerInvalid');
		
		const [ _, val ] = action.split(':');
		
		FP.actions.push(val);
		PlayersDB.set(username, FP);
	} else if (action == 'stop') {
		const FP = PlayersDB.get(username);
		if (!FP) return Lang('fakeplayerInvalid');
		
		FP.actions = [];
		PlayersDB.set(username, FP);
	} else if (action.includes(':')) {
		const FP = PlayersDB.get(username);
		if (!FP) return Lang('fakeplayerInvalid');
		
		const [ act, val ] = action.split(':');
		mc.system.run(() => {
			FP[act](parseInt(val));
		});
	} else {
		const FP = PlayersDB.get(username);
		if (!FP) return Lang('fakeplayerInvalid');
		
		mc.system.run(() => {
			FP[action]();
		});
	}
}

mc.system.runInterval(() => {
	PlayersDB.forEach(player => {
		const { actions } = player;
		for (let act of actions) player[act]();
	});
}, 5);

export { PlayersDB };