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
        const cloneAttributes = false;
        const shadow = this.attachShadow({mode: 'open'});
        
        // Clone the attributes from the shadowRoot and append to shadow dom
        if(cloneAttributes) {
            this.getAttributeNames().forEach(attribute => {
                shadow.setAttribute(attribute, this.getAttribute(attribute))
            })
        }

        // Import the template and replace the variable nodes
        const template = document.importNode(self.template.content, true);
        shadow.appendChild(template);

        // Create some CSS to apply to the shadow dom
        const style = document.createElement('style');
        if (self.style.hasAttribute('type')) {
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
