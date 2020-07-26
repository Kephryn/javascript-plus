// I need to create a loader that can load any sort of asset
// and make it useable as a returnable instance of its type magically.

export class Importer {

    constructor() {
        
    }
    
    fetch(url) {
        window
            .fetch(url)
            .then(e => {

            })
    }
}
