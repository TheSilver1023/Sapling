import Dynamic, { module } from 'stickycore/dynamic'
import Command from 'stickycore/command'
import World from 'stickycore/world'

new Command()
	.setName('help')
	.setCallback(HelpCommand)
	.build();

function HelpCommand(sender) {
	// Commands Data 
	const CAMERA = module.exports['cameras'];
	const SAPLING = module.exports['sapling'];
	const FUNC = module.exports['func'];
	const FAKEPLAYER = module.exports['fakeplayer_guide'];
	const HSS = module.exports['hss_guide'];
	const CONFIG = module.exports['config_guide'];
	const NONE = { PROF: {}, CALC: {} }
	
	const MODULES = { SAPLING, FUNC, CAMERA, FAKEPLAYER, HSS, CONFIG, ...NONE };
	const CMDS = {
		SAPLING: './sapling <feature> <boolean>',
		FUNC: './func <feature> <boolean>',
		CAMERA: './camera <camera>',
		FAKEPLAYER: './fakeplayer <username> <action>',
		PROF: './prof',
		CALC: './calc <expression>',
		HSS: './hss <option> <args>',
		CONFIG: './config <option> <args>'
	}
	const DynamicFeatures = [ 'SAPLING', 'FUNC' ];
	// Feature
	let HelpText = '§¶§qSapling §3Addon §f§lToDo List:§r';
	
	for (let mod in MODULES) {
		const [ content, synthax ] = [ Object.values(MODULES[mod]), CMDS[mod] ];
		
		HelpText += `\n§3${synthax}`;
		
		for (let feature of content) {
			let value = '';
			if (DynamicFeatures.includes(mod)) {
				value = Dynamic.getData(feature);
				value = value ? '§2true' : '§4false';
				HelpText += `\n  §7- ${feature} ${value}`;
			} else if (feature.includes('lang')) {
				value = Dynamic.getData('lang');
				HelpText += `\n  §7- ${feature.replace('$', value)}`;
			} else {
				HelpText += `\n  §7- ${feature} ${value}`;
			}
		}
	}
	
	World.sendMessage(HelpText);
}