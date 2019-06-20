/**
 * @author Yvon Viger
 * @copyright Yvon Viger 2019
 * @exports SelectorInterface
 * @license MIT
 * @version 0.1.0
 */
let shadowClass = self => class extends HTMLElement {
    constructor() {
        super()
        this.style.display = 'none';
        const useEval = false;
        const shadow = this.attachShadow({mode: 'open'});

        // Import the template and replace the variable nodes
        if(typeof self.template == 'string') {
            shadow.innerHTML += self.template;
        }
        else if(self.template instanceof HTMLElement) {
            const template = document.importNode(self.template.content, true);
            shadow.appendChild(template);
        }

        // Clone the attributes from the shadowRoot and append to shadow dom
        this.getAttributeNames().forEach(attribute => {
            let variableNodes = shadow.querySelectorAll(`variable[name='${attribute}']`)
            variableNodes.forEach(variable => {
                variable.replaceWith(document.createTextNode(this.getAttribute(attribute)))
            })

            let variableAttributes = shadow.querySelectorAll(`[data-variable-${attribute}]`)
            variableAttributes.forEach(variable => {
                let attributeName = attribute;
                
                // Check to see if the variable name is different from the attribute
                if(variable.getAttribute(`data-variable-${attribute}`)) {
                    attributeName = variable.getAttribute(`data-variable-${attribute}`);
                }
                variable.setAttribute(attributeName, this.getAttribute(attribute))
                variable.removeAttribute(`data-variable-${attribute}`)
            })
        })

        // Create some CSS to apply to the shadow dom
        if(self.style) {
            const style = document.createElement('style');
            if(typeof self.style === 'string') {
                style.textContent = self.style;
            }
            else if (self.style.hasAttribute('type')) {
                switch(self.style.getAttribute('type')) {
                    case 'text/sass':
                        if(typeof sass === 'undefined') {
                            // throw new Error('Sass is not found');
                            console.error('Sass is not found. Hiding elements');
                            style.textContent = '* { display: none; }';
                        }
                        else {
                            sass.compile(self.style.textContent, function(result) {
                                style.textContent = result.text;
                            });
                        }
                        break;
                    default: 
                        style.textContent = self.style.textContent;
                        break;
                }
            }

            shadow.appendChild(style);
        }

        // Append or eval the script from the shadow dom document
        if(self.script) {
            if(useEval == true) {
                eval(self.script.textContent);
            }
            else {
                const script = document.createElement('script');
                script.textContent = self.script.textContent;
                shadow.appendChild(script);
            }
        }

        this.style.display = 'block';
    }
}


/**
 * @exports Shadow
 * @version 1.0.0
 */
export class Shadow {

    /**
     * 
     * @param {Object} node - Name of shadow dom element
     * @param {String|Object} asset - URL or Object containing Template, Style and Script
     * @param {Object} options 
     */
    constructor(node, asset = null, options = {}) {
        this.version = '1.0.0';
        this.node = node;
        this.template = '';
        this.style = '';
        this.script = '';

        if(asset !== null) {
            if(typeof asset === 'string') {
                fetch(asset)
                    .then(res => res.text())
                    .then(markup => {
                        var parser = new DOMParser();
                        var html = parser.parseFromString(markup, 'text/html');

                        this.template = html.querySelector('template');
                        this.script = html.querySelector('script');
                        this.style = html.querySelector('style');

                        window.customElements.define(this.node, shadowClass(this), options);
                })
            }
            else if(typeof asset === 'object') {
                this.template = asset.template;
                this.script = asset.script;
                this.style = asset.style;

                window.customElements.define(this.node, shadowClass(this), options);
            }
        }
    }
}
