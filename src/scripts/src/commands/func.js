import Dynamic, { module } from 'stickycore/dynamic'
import Command from 'stickycore/command' 
import World from 'stickycore/world'
import Lang from 'src/config/langs'

new Command()
	.setName('func')
	.addArgument('string', 'feature')
	.addArgument('boolean', 'enable')
	.setCallback(features)
	.build();
	
function features(sender, args) {
	const features = module.exports['func'];
	const { feature, enable } = args;
	const _f = feature.toLowerCase();
	const validFeature = features[_f];
	const txtOut = enable ? 'enabled' : 'disabled';
	
	if (validFeature) {
		Dynamic.setData(validFeature, enable);
		Lang(txtOut, validFeature);
	} else {
		World.sendMessage(`§cInvalid feature: '${_f}'`);
	}
}