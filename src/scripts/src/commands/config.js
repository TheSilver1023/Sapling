import Dynamic, { module } from 'stickycore/dynamic'
import Command from 'stickycore/command'
import World from 'stickycore/world'
import Lang from 'src/config/langs'

new Command()
	.setName('config')
	.addArgument('string', 'option')
	.addArgument('string|boolean', 'value')
	.setCallback(ConfigCommand)
	.build();
	
function ConfigCommand (sender, args) {
	// Config
	const { option, value } = args;
	const op = option.toLowerCase();
	// Command
	if (op == 'lang') {
		const l = value.toUpperCase();
		if (!['EN','ES','PT','ZH','JA'].includes(l)) {
			return Lang('invalidLang');
		}
		Dynamic.setData('lang', l);
		Lang('newLang');
	}
	else if (op == 'gamerulesfix' && typeof value == 'boolean') {
		Dynamic.setData('gameRulesFix', value);
		Lang(value ? 'enabled' : 'disabled', 'gameRulesFix');
	}
	else if (op == 'setallvalues' && typeof value == 'boolean') {
		const { sapling, func } = module.exports;
		const features = { ...sapling, ...func }
		const props = [];
		
		for (let x in features) {
			const prop = features[x];
			props.push(prop);
			
			Dynamic.setData(prop, value);
		}
		
		Lang(value ? 'enabled' : 'disabled', props.join(', '));
	}
	else Lang('invalidValue');
}