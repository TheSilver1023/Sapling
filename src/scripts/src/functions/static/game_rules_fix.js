import * as mc from '@minecraft/server'
import Dynamic from 'stickycore/dynamic'

mc.system.runInterval(() => {
	if (!Dynamic.getData('gameRulesFix')) return;
	
	mc.world.gameRules.doMobSpawning = true;
	mc.world.gameRules.doDayLightCycle = true;
	mc.world.gameRules.randomTickSpeed = 1;
}, 20);