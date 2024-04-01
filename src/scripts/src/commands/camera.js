import * as mc from '@minecraft/server'
import Command from 'stickycore/command' 
import World from 'stickycore/world'
	
new Command()
	.setName('camera')
	.addArgument('string', 'option')
	.setCallback((sender, { option }) => {
		mc.system.run(() => {
			switch (option.toLowerCase()) {
				case 'free':
				case 'c':
					sender.removeTag('static_camera');
					sender.addTag('free_camera');
					World.sendMessage('§7free camera in use');
					break;
				
				case 'reset':
				case 's':
					sender.removeTag('static_camera');
					sender.removeTag('free_camera');
					World.sendMessage('§7camera restored');
					break;
					
				case 'static':
				case 't':
					if (!sender.hasTag('free_camera')) return World.sendMessage('§eFirst set the camera to \'free\' mode')
					sender.addTag('static_camera');
					World.sendMessage('§7static camera in use');
					break;
				
				default:
					World.sendMessage('§cInvalid camera: ' + option);
					break;
			}
		});
	})
	.build();