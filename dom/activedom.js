/**
 * @author Yvon Viger
 * @copyright Yvon Viger 2019
 * @exports ActiveDom
 * @license MIT
 * @version 0.1.0
 */
export class ActiveDom {
	
	/**
	 * @param  {string} namespace=document.documentElement.namespaceURI
	 * @param  {boolean} invasive=false - Flag for wether or not to invade the DOM by setting a prototype on Element
	 */
	constructor(namespace = document.documentElement.namespaceURI, invasive = false) {
		let self = this;
		this.version = '3.0.0';
		this.namespace;
		this.namespaces = {
			xmlns: 'http://www.w3.org/2000/xmlns/',
			xlink: 'http://www.w3.org/1999/xlink',
			xshema: 'https://www.w3.org/2001/XMLSchema',
			svg: {
				'http://www.w3.org/2000/svg' : ['a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'discard', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hatch', 'hatchpath', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'solidcolor', 'stop', 'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'unknown', 'use', 'view', 'vkern']
			},
			xinclude: {
				'http://www.w3.org/2001/XInclude': ['include', 'fallback'],
			},
			xhtml: {
				'http://www.w3.org/1999/xhtml': [
					'a', 'abbr', 'acronym', 'address', 'big', 'blockquote', 'cite', 'code', 'dfn', 'em', 'kbd', 'samp', 'strong', 'span', 'small', 'sup', 'sub', /*'var'*/ //Inline Elements
					'caption', 'col', 'colgroup', 'table', 'thead', 'tbody', 'tfoot', 'th', 'tr', 'td', //Table Elements
					'button', 'fieldset', 'legend', 'textarea', 'input', 'select', 'option', 'optgroup', 'label', //Form Elements
					'dl', 'dd', 'dt', 'ol', 'ul', 'li', //List Elements
					'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'pre', 'script', 'p', 'div', //Other Block Elements
					'script', 'link', 'iframe', 'body' //test
				],
			},
			mathml: {
				'http://www.w3.org/1998/Math/MathML': [
					// Top-level elementsSection 
					'math',
					// Token elementsSection 
					'mglyph', 'mi', 'mn', 'mo', 'ms', 'mspace', 'mtext',
					// General layoutSection
					'menclose', 'merror', 'mfenced', 'mfrac', 'mpadded', 'mphantom', 'mroot', 'mrow', 'msqrt', 'mstyle',
					// Script and limit elementsSection
					'mmultiscripts', 'mover', 'mprescripts', 'msub', 'msubsup', 'msup', 'munder', 'munderover', 'none',
					// Tabular mathSection 
					'maligngroup', 'malignmark', 'mlabeledtr', 'mtable', 'mtd', 'mtr',
					// Elementary mathSection
					'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'msline', 'msrow', 'mstack',
					// Uncategorized elementsSection
					'maction',
					// Semantic annotationsSection
					'annotation', 'annotation-xml', 'semantics'
				]
			},
			html5: {
				'http://www.w3.org/TR/html5': ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr']
			}
		};

		this.namespace = namespace;

		var nodeset = [];
		for(var ns in this.namespaces) {
			if(this.namespaces.hasOwnProperty(ns)) {
				if(typeof this.namespaces[ns] !== 'string') {
					for(var namespaceURI in this.namespaces[ns]) {
						if(this.namespaces[ns].hasOwnProperty(namespaceURI)) {
							if(namespaceURI === namespace) {
								nodeset = this.namespaces[ns][namespaceURI];
							}
						}
					}
				}
			}
		}

		// Create the wrapper method
		var cacheMethod = (element) => {
			self[element.toUpperCase().replace(/-/g, '')] = function() {
				return self.create.apply(self, [element, namespace, arguments]);
			}
		}

		// Call the wrapper for each node
		for(var i = 0; i < nodeset.length; i++) {
			cacheMethod(nodeset[i]);
		}

		if(invasive) {
			Element.prototype.set = function() {
				self.set.apply(self, [this, arguments[0]]);
			}

			let HandleMultiple = function() {
				for(let element of this) {
					if(this.debug)
						console.assert(element instanceof Element, 'Element cannot set attributes', element)

					if(element instanceof Element === true) {
						self.set.apply(self, [element, arguments[0]]);
					}
				}
			}
			NodeList.prototype.set = HandleMultiple;
		}
	}


	/**
	 * Set the attributes for a given node
	 *
	 * @param {HTMLElement} element
	 * @param {Array} attributes
	 */
	set(element, attributes) {
		for(let property in attributes) {
			if(attributes.hasOwnProperty(property)) {
				var attribute = attributes[property];

				if(property === 'style' || property === 'styles') {
					if(typeof attribute === 'string') {
						element.style.cssText = attribute;
					}
					else {
						this.setStyles(element, attribute);
					}
				}
				else if(property === 'event' || property === 'events') {
					this.setEvents(element, attribute);
				}
				else if(property === 'class' || property === 'className') {
					if(attribute instanceof Array) {
						attribute = attribute.join(' ')
					}

					if(this.namespace === 'http://www.w3.org/1999/xhtml') {
						element.className = attribute;
					}
					else {
						element.setAttribute('class', attribute);
					}
				}
				else if(property === 'data' || property === 'dataset') {
					this.setDatasets(element, attribute);
				}
				else if(property === 'text') {
					element.textContent = attribute;
				}
				else if(property === 'html' || property === 'markup') {
					this.setMarkup(element, attribute);
				}
				else if(property === 'append') {
					this.setMarkup(element, attribute, true);
				}
				else if(property.indexOf(':') !== -1) {
					var nsProp = property.split(':');

					if(nsProp.length !== 2) {
						throw new Error('Exactly one namespace and property required.');
					}

					if(this.namespaces[nsProp[0]] === undefined) {
						throw new Error('The selected namespace does not exist')
					}

					element.setAttributeNS(
						this.namespaces[nsProp[0]],
						property,
						attribute
					);
				}
				else {
					// DOCUMENT_NODE === 9
					if(element.nodeType === element.DOCUMENT_NODE) {
						element = element.documentElement;
					}

					element.setAttribute(property, attribute);
				}
			}
		}

		return element;
	}

	/**
	 * Set the dataset for a given node
	 *
	 * @param {HTMLElement} element
	 * @param {Array} dataset
	 */
	setDatasets(element, dataset) {
		for(let property in dataset) {
			if(dataset.hasOwnProperty(property)) {
				if(property.indexOf('-') !== -1) {
					throw new Error('You cannot use spine case and must use camel case for data properties.');
				}

				if(dataset.hasOwnProperty(property)) {
					element.dataset[property] = dataset[property];
				}
			}
		}

		return element;
	}


	/**
	 * Set the styles for a given node
	 *
	 * @param {HTMLElement} element
	 * @param {Array} styles
	 */
	setStyles(element, styles) {
		for(let property in styles) {
			if(styles.hasOwnProperty(property)) {
				element.style[property] = styles[property];
			}
		}

		return element;
	}


	/**
	 * Set the dataset for a given node
	 *
	 * @param {HTMLElement} element
	 * @param {Array} events
	 */
	setEvents(element, events) {
		for(let event in events) {
			if(events.hasOwnProperty(event)) {
				if(element.on !== undefined) {
					element.on.apply(element, [
						typeof event === 'function' ? event.name : event,
						events[event]
					])
				}
				else {
					element.addEventListener(event, events[event], false)
				}
			}
		}

		return element;
	}


	/**
	 * Set the dataset for a given node
	 *
	 * @param {HTMLElement} element
	 * @param {String, HTMLElement, SVGElement} markup
	 * @param {Boolean} append - Append or replace content
	 */
	setMarkup(element, markup, append = false) {

		if(typeof markup === 'string') {
			if(element instanceof HTMLElement) {
				if(append) {
					element.innerHTML += markup
				}
				else {
					element.innerHTML = markup
				}
			}
			// Assume we are dealing with some sort of xml and create a namespaced document fragment
			else {

			}
		}
		else if(markup instanceof Array) {
			for(let html of markup) {
				this.setMarkup(element, html, append);
			}
		}
		else if(markup instanceof HTMLElement) {
			if(element instanceof HTMLElement) {
				// Removed all children
				if(!append) {
					for(let child of element.childNodes) {
						child.remove()
					}
				}

				element.appendChild(markup)
			}
			else if(element instanceof SVGElement) {
				element.appendChild(markup)
			}
			// Assume we are dealing with some sort of xml and create a namespaced document fragment
			else {

			}
		}
		else if(markup instanceof SVGElement) {
			if(element instanceof HTMLElement) {
				// Removed all children
				if(!append) {
					for(let child of element.childNodes) {
						child.remove()
					}
				}

				element.appendChild(markup)
			}
			// Assume we are dealing with some sort of xml and create a namespaced document fragment
			else {

			}
		}
		else {
			throw new Error('I don\'t know how to handle this content')
		}
	}


	/**
	 * Create an element
	 *
	 * @param {string} node
	 * @param {string} namespace
	 */
	create(node, namespace = this.namespace) {
		let element;

		if(node === 'svg') {
			element = document.implementation.createDocument(namespace, 'svg', null).childNodes[0];
		}
		else {
			element = document.createElementNS(namespace, node);
		}

		this.populate.apply(this, [element, arguments[2]]);

		return element;
	}


	/**
	 * Populate the attributes, styles, dataset and events of an element
	 *
	 * @param {HTMLElement} element
	 */
	populate(element) {

		/* Assign Attributes */
		let i = 0, firstArgument = arguments[1][0];

		if(!(firstArgument instanceof Node) && typeof(firstArgument) === 'object') {
			i++;
			element = this.set(element, firstArgument);
		}

		for(let index = i; index < arguments[1].length; index ++) {
			if(arguments[1][index] === null) {
				continue;
			}

			if(typeof(arguments[1][index]) === 'object' && arguments[1][index].length > 0) {
				for(let item of arguments[1][index]) {
					element.appendChild(item);
				}
				// arguments[1][index].forEach(item => {
				// 	element.appendChild(item);
				// });
				continue;
			}

			switch(typeof(arguments[1][index])) {
				case null:
					break;
				case 'string':
					element.innerHTML += arguments[1][index];
					// element.appendChild(document.createTextNode(arguments[1][index]));
					break;

				case 'html':
				case 'svg':
				default:
					element.appendChild(arguments[1][index]);
					break;
			}
		}

		return element;
	}


	/**
	 * Render function with methods wrapped
	 *
	 * @param {function} context
	 */
	render(context) {
		let self = this;

		return context.apply({}, [function(node) {
			let args = Array.prototype.slice.call(arguments);
			args.shift();

			if(!self[node.toUpperCase()]) {
				throw new Error('The node doesn\'t exist ' + node);
			}

			return self[node.toUpperCase()].apply({}, args);
		}])
	}
}
