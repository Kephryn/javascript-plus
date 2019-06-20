/**
 * @author Yvon Viger
 * @copyright Yvon Viger 2019
 * @exports SelectorInterface
 * @license MIT
 * @version 0.1.0
 */
export class SelectorInterface {
    /**
     * Class for selecting objects in a dom
     * @param  {boolean} debug=false
     */
    constructor(debug = false) {
        this.debug = debug;
        this.context;
        this.selector;
        this.method;
        this.version = '0.1.0';

        return (selector, doc = document) => this.match(selector, doc)
    }

    /**
     * Match the selector to the given document
     * @param  {string} selector
     * @param  {Object} doc=document
     */
    match(selector, doc = document) {
        if(typeof selector === 'string') {
            // Check to see if the passed string is an ID selector
            if(selector[0] === '#' && /#[a-zA-Z0-9-_]*$/.test(selector)) {
                if(this.debug)
                    console.log('ID selector detected');

                return doc.getElementById(selector.substr(1));
            }
            // Check to see of the string is an xPath selector
            else if(selector.indexOf('/') !== -1) {
                if(this.debug)
                    console.log('xPath selector detected');

                let result = doc.evaluate(selector, doc, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                let collection = [];
                let item;

                while(item = result.iterateNext()) {
                    collection.push(item)
                }

                return createNodeList(collection);
            }
            // Default to a query selector
            else {
                if(this.debug)
                    console.log('Default query selector')

                return doc.querySelectorAll(selector)
            }
        }
        else {
            throw new Error('Expected argument is a string you sent ' + typeof selector)
        }
    }
}

function createNodeList(collection) {
    // make an empty node list to inherit from
    var nodelist = document.createDocumentFragment().childNodes;
    // return a function to create object formed as desired
    let properties = {
        length: {
            value: collection.length
        },
        item: {
            value: function (i) {
                return this[+i || 0];
            },
            enumerable: true
        }
    }

    for(let i = 0; i < collection.length; i++) {
        properties[i] = {
            value: collection[i],
            enumerable: true
        }
    }

    return Object.create(nodelist, properties); // return an object pretending to be a NodeList
}
