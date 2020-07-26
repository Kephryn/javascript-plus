// event+.js
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

    derived(selector, handler) {
        console.log(selector);
        console.log(handler);
        console.log(this);
    }

    emit(name, detail) {
        let callback = target => {
            let custom = !('on' + name in target);
            let event;

            if(custom) {
                event = new CustomEvent(name, {
                    detail
                })
            }
            // else if() {}
            else {
                event = new Event(name);
            }

            this.dispatchEvent(event);
        }

        if(this instanceof NodeList) {
			this.forEach(item => {
                callback(item)
            })
        }
        else {
            callback(this);
        }
    }

    on(event, handler) {
        let callback = target => {
            // Wrapper method this way we can reference it but also infuse it
            let wrapper = e => handler.call(target, e);

            let custom = !('on' + event in target);

            console.log(this)
            console.log(this.length)

            if(target.addEventListener !== undefined) {
                target.addEventListener(event, wrapper)
            }
            else {
                throw new Error('Cannot attach anything')
            }
        }

        if(this instanceof NodeList) {
			this.forEach(item => {
                callback(item)
            })
        }
        else {
            callback(this);
        }

    }

    constructor() {

        let EventMethods = [
            'derived',
            'is'
        ]

        let EventTargetMethods = [
            'on',
            'once',
            'off',
            'emit',
        ];

        EventMethods.forEach(method => {
            Event.prototype[method] = this[method];
        })

        EventTargetMethods.forEach(method => {
            console.log(method)
            EventTarget.prototype[method] = this[method];
            NodeList.prototype[method] = this[method];
        })
    }
}

let ei = new EventInterface();