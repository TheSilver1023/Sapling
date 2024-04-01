import * as mc from '@minecraft/server'
import List from './src/event_list'
import Parser from './builder/_event'

class Event {
	static #localInstances = [];
	static #globalInstances = {
		after: {},
		before: {}
	};
	static #globalCallbacks = {
		after: {},
		before: {}
	};
	
	static beforeTrack(event, callback, op = { parser: true, local: false }) {
		const { beforeEvents } = mc.world;
		
		if (op.local) {
			let localEvent = beforeEvents[event].subscribe(_ev => {
				if (op.parser) {
					let ev = new Parser(_ev);
					callback(ev);
				} callback(_ev);
			});
			this.#localInstances.push(localEvent);
		} else {
			if (!this.#globalInstances.before[event]) {
				let global = beforeEvents[event].subscribe(_ev => {
					let callbacks = Event.getCallbacks('before', event);
					if (op.parser) {
						let ev = new Parser(_ev)
						callbacks.forEach(_ => _(ev));
					} else callbacks.forEach(_ => _(_ev));
				});
				this.#globalInstances.before[event] = global;
				this.#globalCallbacks.before[event] = [];
			}
			
			this.#globalCallbacks.before[event].push(callback);
		}
	}
	
	static afterTrack(event, callback, op = { parser: true, local: false }) {
		const { afterEvents } = mc.world;
		
		if (op.local) {
			let localEvent = afterEvents[event].subscribe(_ev => {
				if (op.parser) {
					let ev = new Parser(_ev);
					callback(ev);
				} callback(_ev);
			});
			this.#localInstances.push(localEvent);
		} else {
			if (!this.#globalInstances.after[event]) {
				let global = afterEvents[event].subscribe(_ev => {
					let callbacks = Event.getCallbacks('after', event);
					if (op.parser) {
						let ev = new Parser(_ev)
						callbacks.forEach(_ => _(ev));
					} else callbacks.forEach(_ => _(_ev))
				});
				this.#globalInstances.after[event] = global;
				this.#globalCallbacks.after[event] = [];
			}
			
			this.#globalCallbacks.after[event].push(callback);
		}
	}
	
	static getCallbacks(time, event) {
		return this.#globalCallbacks[time][event];
	}
}

export default Event;