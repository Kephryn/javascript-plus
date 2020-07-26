/*
Rename project to JEI (Javascript Event Interface)

This project needs a lot of work but has the most potential.

The goals of this project are to:
	* √ create an event interface that is independent of javascript framework
	* 1/2 synthesize events
	* √ create custom events
	* √ attach/remove/manage event listeners to elements
	* 1/2 have ability to easily express event stacks
	* √ create a simple yet robust standard for all events
	* use promises and not callbacks
	* Support name spaces for easier management of event groups
	* Support for Object.observe to be treated like regular event

	* CLEAN UP EVENT MESSINESS TO DOM, at least make the values properly
		https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

	Sources
		* https://developer.mozilla.org/en-US/docs/Web/API/Event
		* http://perfectionkills.com/whats-wrong-with-extending-the-dom/
		* https://github.com/jkroso/dom-event
		* https://github.com/pazguille/jvent
		* https://github.com/jiem/my-class
        * https://developer.mozilla.org/en-US/docs/Web/Reference/Events
        * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget

    Symbols
        * https://developer.mozilla.org/en-US/docs/Glossary/Symbol
        * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
        * https://www.keithcirkel.co.uk/metaprogramming-in-es6-symbols/

	Custom Events
		* http://stackoverflow.com/questions/5342917/custom-events-in-ie-without-using-libraries
		* https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
		https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events

	Weather XML
		* http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/ON/s0000430_e.xml


	TESTING
		* http://visionmedia.github.io/mocha/
        * http://qunitjs.com/


	2019:
		* https://medium.com/@zandaqo/eventtarget-the-future-of-javascript-event-systems-205ae32f5e6b

*/
/**
 * @author Yvon Viger
 * @copyright Yvon Viger 2019
 * @exports EventInterface
 * @license MIT
 * @version 0.3.0
 */
export class EventInterface {
    /*!
		CHANGELOG
		0.3.0
			- Imported project to JS+
		0.2.0
			- Added Object.observe
		0.1.1
			- Thinking of removing stacking and moving elsewhere, this would allow for chaining
			- Addressed issues with event delegation, delegation now works when delegate is supplied via queryselector string
		0.1.0
			- Added version
			- Added proper event delegation
			- Added delegation across frames
			- Addressed issue with wrapper and construction of EventInterface
			- Added .off method to remove event listeners
			- Added method alias 'emit' for 'trigger', emit will become the default and replace trigger
		0.0.1
			- A lot of structure changes made this library incompatible with previous releases.
		0.0.0
			- This version was the initial commit and the proof of concept.
	 		- Added all of the functionality as I saw fit, I did a lot of work to get things working. I created the Arcade which used this as the base. Though this might have been a mistake to use too early.

	 */
	static [Symbol.hasInstance](obj) {
		console.log(obj)
	}

	get [Symbol.toStringTag]() {
		return 'EventInterface'
	}

    constructor(invasive = true) {
		let self = this
		/**
		 * @string version of the application
		 */
		this.version = '0.3.0';

		this.self;

		this.exposed = [
			'on',
			'once',
			'off',
			'stack',
			'emit',
			'delegate',
		];

		this.stack = {};

		//List of all event types and their handlers
		this.events = {
			abort: null,
			afterprint: null,
			beforeprint: null,
			beforeunload: null,
			blur: null,
			canplay: EventInterface.media,
			canplaythrough: EventInterface.media,
			change: null,
			click: function(name, o) {
				'clicks' in o ||(o.clicks = 1)
				return EventInterface.mouse.call(this, 'click', o)
			},
			contextmenu: EventInterface.mouse,
			copy: EventInterface.clipboard,
			cuechange: EventInterface.media,
			cut: EventInterface.clipboard,
			dblclick: function(name, o) {
				'clicks' in o ||(o.clicks = 2)
				return EventInterface.mouse.call(this, 'dblclick', o)
			},
			DOMContentLoaded: null,
			drag: EventInterface.mouse,
			dragend: EventInterface.mouse,
			dragenter: EventInterface.mouse,
			dragleave: EventInterface.mouse,
			dragover: EventInterface.mouse,
			dragstart: EventInterface.mouse,
			drop: EventInterface.mouse,
			durationchange: EventInterface.media,
			emptied: EventInterface.media,
			ended: EventInterface.media,
			error: null,
			focus: null,
			focusin: null,
			focusout: null,
			formchange: null,
			forminput: null,
			hashchange: EventInterface.url,
			input: null,
			invalid: null,
			keydown: EventInterface.keyboard,
			keypress: EventInterface.keyboard,
			keyup: EventInterface.keyboard,
			load: null,
			loadeddata: null,
			loadedmetadata: null,
			loadstart: EventInterface.xhr,
			message: EventInterface.socket,
			mousedown: EventInterface.mouse,
			mouseenter: EventInterface.mouse,
			mouseleave: EventInterface.mouse,
			mousemove: EventInterface.mouse,
			mouseout: EventInterface.mouse,
			mouseover: EventInterface.mouse,
			mouseup: EventInterface.mouse,
			mousewheel: EventInterface.mouse,
			offline: null,
			online: null,
			pagehide: null,
			pageshow: null,
			paste: EventInterface.clipboard,
			pause: EventInterface.media,
			play: EventInterface.media,
			playing: EventInterface.media,
			popstate: null,
			progress: EventInterface.xhr,
			ratechange: null,
			readystatechange: EventInterface.xhr,
			redo: EventInterface.clipboard,
			reset: null,
			resize: EventInterface.html,
			scroll: null,
			seeked: EventInterface.media,
			seeking: EventInterface.media,
			select: null,
			show: EventInterface.mouse,
			stalled: EventInterface.media,
			storage: EventInterface.storage,
			submit: null,
			suspend: EventInterface.media,
			timeupdate: EventInterface.media,
			undo: EventInterface.clipboard,
			unload: null,
			volumechange: EventInterface.media,
			waiting: EventInterface.media
		}

        if(!invasive) {
			console.warn('Whoa, being invasive is the point.')
			console.log('It\'s a good point. This should work without DOM/ES alteration')
		}

		EventTarget.prototype.events = {}
		this.exposed.forEach(expose => {
			EventTarget.prototype[expose] = function () {
				return self[expose].apply({
					target: [this],
					ei: self
				}, arguments);
			};

			NodeList.prototype[expose] = function () {
				return self[expose].apply({
					target: this,
					ei: self
				}, arguments);
			};
		});


		return obj => {
			this.target = obj
			return this
		}
	}

	/**
	 * Create a mouse event
	 *
	 *   event('click', {})
	 *   event('mousedown', {bubbles: false})
	 *
	 * @param {String} name
	 * @param {Object} o
	 * @return {HTMLEvent}
	 * @api private
	 */

	static mouse(name, o) {
		// var event = document.createEvent('MouseEvents');
		// event.initMouseEvent(
		// 	name,
		// 	o.bubbles !== false,
		// 	o.cancelable !== false,
		// 	window,
		// 	o.clicks,
		// 	o.screenX || 0,
		// 	o.screenY || 0,
		// 	o.clientX || 0,
		// 	o.clientY || 0,
		// 	o.ctrl === true,
		// 	o.alt === true,
		// 	o.shift === true,
		// 	o.meta === true,
		// 	o.button || 0,
		// 	o.relatedTarget
		// );

		return new MouseEvent(name, o);

		// return event;
	}

	/**
	 * Create a html document event
	 *
	 *   event('blur', {})
	 *   event('change', {bubbles: false})
	 *
	 * @param {String} name
	 * @param {Object} o
	 * @return {HTMLEvent}
	 * @api private
	 */

	static html(name, o) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent(name,
			o.bubbles !== false,
			o.cancelable !== false
		);
		return event;
	}

	/**
	 * Create a keyboard event
	 *
	 *   event('keypress', {
	 *     key: 'enter'
	 *   })
	 *
	 * @param {String} type
	 * @param {Object} o
	 * @return {KeyboardEvent}
	 * @api private
	 */

	static keyboard(type, o) {
		var key = o.key || 'a';
		var keycode = codes[key];
		if(!keycode) throw new Error('invalid key: '+key);

		var charCode = key.length === 1 ? key.charCodeAt(0) : 0;

		// Prefer custom events to avoid webkits bug
		// https://bugs.webkit.org/show_bug.cgi?id=16735
		if(Event) {
			var e = customEvent(type, o)
			e.keyCode = keycode;
			e.charCode = charCode;
			e.shift = o.shift === true;
			e.meta = o.meta === true;
			e.ctrl = o.ctrl === true;
			e.alt = o.alt === true;
		}
		else {
			var e = document.createEvent('KeyboardEvent')
			e[e.initKeyEvent ? 'initKeyEvent' : 'initKeyboardEvent'](
				type,
				o.bubbles !== false,
				o.cancelable !== false,
				window,
				o.ctrl === true,
				o.alt === true,
				o.shift === true,
				o.meta === true,
				keycode,
				charCode
			)
		}
		return e;
	}


	/**
	 * Create a custom event
	 *
	 *   custom('select', {
	 *     bubbles: false
	 *   })
	 *
	 * @param {String} name
	 * @param {Object} o
	 * @return {Event}
	 * @api private
	 */

	static custom(name, data) {

		return new CustomEvent(name, {
			bubbles: data.bubbles !== false,
			cancelable: data.cancelable !== false,
			detail: data,
			reference: this
		});

		// return new Event(name, {
		// 	bubbles: o.bubbles !== false,
		// 	cancelable: o.cancelable !== false
		// });

	}

	static media(name, o) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent(name,
			o.bubbles !== false,
			o.cancelable !== false
		);
		return event;
	}

	static xhr(name, o) {

	}

	static clipboard(name, o) {

	}

	static url(name, o) {

	}

	static socket(name, o) {

	}

	static storage(name, o) {

	}


	// This is the event wrapper, here we can add the following
	// 		* Event Delegation
	// 		* Event Namespaces and Symbols for tracking
	/**
	 * on is a addEventListener replacement
	 *
	 * @param {String} name namespace of the event
	 * @param {Function} callback The event function callback
	 */
    on(namespace, callback) {
		this.target.forEach(target => {

			if(target.addEventListener === undefined) {
				return console.error('Cannot add event listener to Object')
			}

			// let namespace = '';
			let ei = this.ei || this;

			namespace = new EventNamespace(namespace)

			// Check to see if the event is a custom event or not
			let custom = !('on' + namespace.event in target);

			// if(custom) {
			// 	console.log(custom, this, namespace.event)
			// }

			// Make sure that the event namespace.event array exists
			if(typeof target.events[namespace.event] !== 'array') {
				target.events[namespace.event] = [];
			}
			// console.warn(namespace.event)

			// Wrapper method this way we can reference it but also infuse it
			let wrapper = e => callback.call(target, e);

			// Add the event to the event stack
			target.events[namespace.event].push(
				ei.register(
					namespace,
					target,
					wrapper
				)
			)

			// console.log(target.prototype instanceof EventTarget)
			if(target.addEventListener === undefined && typeof target === 'object') {
				console.log('PROXY')
				let proxy = new Proxy(target, {
					get() {
						console.log(arguments)
					},
					set() {
						console.log(arguments)
					},
					deleteProperty() {
						console.log(arguments)
					},
					has() {
						console.log(arguments)
					},
				});
				console.log(proxy)
				// return console.error('Cannot add event listener to Object', target)
			}
			else if(target.addEventListener !== undefined) {
				target.addEventListener(namespace.event, wrapper)
			}
			else {
				throw new Error('Cannot attach anything')
			}
		})

		return this.target
	}

	once(name, callback = false) {

	}

	off(namespace, callback = false) {
		namespace = new EventNamespace(namespace)
		if(!callback) {
			if(!this.target.events[namespace]) {
				// console.log(this.target.events)
			}

			for(let prop in this.target.events) {

				for(let event of this.target.events[prop]) {
					if(namespace.matches(event.namespace)) {
						// console.log('Removing', event)
						console.log(event)
						event.element.removeEventListener(event.namespace.event, event.callback);
					}
				}
			}
		}
		else {
			this.target.removeEventListener(namespace, callback);
		}

		return this.target;

	}

	emit(namespace, o = {}) {
		namespace = new EventNamespace(namespace)

		let custom = !('on' + namespace.event in this.target);

		// console.log(this.ei.events)

		if(custom) {
			// console.log(custom, this.target.events, namespace.event, this.target.events[namespace.event])
			if(!this.target.events[namespace.event]) {
				return console.warn('The event was not found: "' + namespace.event + '" for...', this.target)
			}

			for(let stack of this.target.events[namespace.event]) {
				if(namespace.matches(stack.namespace) || stack.namespace.event === namespace.event) {

					let event = new CustomEvent(namespace.event, {
						bubbles: true,
						detail: o
					})

					this.target.dispatchEvent(event);
				}
			}
		}
		else {
			if(!this.ei.events[namespace.event]) {
				return console.warn('The event was not found: "' + namespace.event + '" for...', this.target)
			}

			let event = this.ei.events[namespace.event].call(
				this.target,
				namespace.event,
				o
			);
			// console.log(event)
			this.target.dispatchEvent(event);
		}


		return this.target;
	}

	handle(method) {
		return this[method];
	}

	stack() {}

	delegate() {}
	make() {}

	register(namespace, element, callback) {
		let target = this.stack;
		// namespace = new EventNamespace(namespace);
		namespace.stack.forEach(space => {
			if(typeof target[space] !== 'object') {
				target[space] = {};
			}
			target = target[space];
		})

		if(typeof target[namespace.event] !== 'array') {
			target[namespace.event] = [];
		}

		let index = target[namespace.event].push({
			element,
			callback,
			namespace
		})

		return target[namespace.event][index-1];
	}
}

class EventNamespace {
	// namespace;

	constructor(namespace) {
		this.namespace = namespace.split('.');
	}

	get event() {
		return this.namespace[this.namespace.length - 1];
	}

	get stack() {
		return this.namespace;
	}

	get full() {
		return this.namespace.join('.');
	}

	matches(namespace) {
		if(namespace instanceof EventNamespace) {
			namespace = namespace.full
		}

		// console.log(namespace,this.full, new RegExp(`^${namespace.replace('.', '\.')}.*?`).test(this.full))
		return new RegExp(`^${this.full.replace('.', '\.')}.*?`).test(namespace)
	}

	is() {

	}
}


class EventStack {
	constructor() {
		this.stack = {};
	}

	get [Symbol.toStringTag]() {
		return 'EventStack';
	}

	// [Symbol.search](namespace) {
	// 	return string.indexOf(this.value);
	// }

	stack(namespace, element, callback) {
		this.stack[namespace] = {element, callback};
	}

	// set (namespace, value) {
	// 	console.log(namespace, value, this);
	// }

	// get (namespace) {

	// }
}

// var EventTarget = function() {
//     this.listeners = {};
//   };

//   EventTarget.prototype.listeners = null;
//   EventTarget.prototype.addEventListener = function(type, callback) {
//     if (!(type in this.listeners)) {
//       this.listeners[type] = [];
//     }
//     this.listeners[type].push(callback);
//   };

//   EventTarget.prototype.removeEventListener = function(type, callback) {
//     if (!(type in this.listeners)) {
//       return;
//     }
//     var stack = this.listeners[type];
//     for (var i = 0, l = stack.length; i < l; i++) {
//       if (stack[i] === callback){
//         stack.splice(i, 1);
//         return;
//       }
//     }
//   };

//   EventTarget.prototype.dispatchEvent = function(event) {
//     if (!(event.type in this.listeners)) {
//       return true;
//     }
//     var stack = this.listeners[event.type].slice();

//     for (var i = 0, l = stack.length; i < l; i++) {
//       stack[i].call(this, event);
//     }
//     return !event.defaultPrevented;
//   };
