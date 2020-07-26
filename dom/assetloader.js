// I need to create a loader that can load any sort of asset
// and make it useable as a returnable instance of its type magically.

/**
 * @author Yvon Viger
 * @copyright Yvon Viger 2019
 * @exports AssetLoader
 * @license MIT
 * @version 0.1.0
 */
export class AssetLoader {

    // Lets see if there are any options that would make sense for this
    // The fact that this is a class is kindof stupid, it's basically a collection
    // of funtions
    // Exporting an actual Get function might be more useful rather than having to instanciate
    constructor() {
    }

    /**
     * Handle the Audio response
     * @param {object} response Audio Response object
     */
    Audio(response) {
        let audio = document.createElement('audio');
        audio.src = URL.createObjectURL(response);
        return audio;
    }

    /**
     * Handle the Image response
     * @param {object} response Image Response object
     */
    Image(response) {
        let image = document.createElement('img');
        image.src = URL.createObjectURL(response);
        return image;
    }

    /**
     * Handle the Json response
     * @param {object} response Json Response object
     */
    Json(response) {
        return response;
    }

    /**
     * Handle the Html response
     * @param {object} response Html Response object
     */
    Html(response) {
        let iframe = document.createElement('iframe');
        iframe.contentWindow.document.innerHTML = response;
        return document.adoptNode(iframe.contentWindow.document);
    }

    /**
     * Handle the Default response
     * @param {object} response Default Response object
     */
    Default(response) {
        return response;
    }

    /**
     * This is the mime handler, it will check the mimeType and assign the proper handler
     *
     * @param {object} response The returnable object
     * @param {string} mimeType The mimeType of the request
     */
    mimeHandler(response, mimeType) {
        let result;

        switch(mimeType) {
            case 'application/ogg':
            case 'application/mp3':
            case 'application/wave':
            case 'application/flac':
            case 'application/webm':
            case 'application/weba':
                result = {
                    handler: this.Audio,
                    return: response.blob()
                };
                break;

            case 'text/html':
                    result = {
                        handler: this.Html,
                        return: response.text()
                    };
                break;

            case 'application/json':
                    result = {
                        handler: this.Json,
                        return: response.json()
                    };
                break;

            case 'image/jpeg':
            case 'image/gif':
            case 'image/png':
            case 'image/webp':
                    result = {
                        handler: this.Image,
                        return: response.blob()
                    };
                break;

            default:
                console.log(mimeType)
                result = {
                    handler: this.Default,
                    return: response.text()
                };
                break;
        }

        return result;
    }

    /**
     * Load function creates the asset and passes it back to the coder prepared.
     *
     * @param {string} url Location to load
     */
    load(url) {
        return new Promise((resolve, reject) => {
            let handler;

            window
                .fetch(url)
                .then(response => {
                    var contentType = response.headers.get('content-type');
                    let mime = this.mimeHandler(response, contentType);

                    if(!mime.handler) {
                        return reject(mime.handler + ': handler not found');
                    }

                    handler = mime.handler;
                    return mime.return;

                })
                .then(r => {
                    resolve(handler.call(this, r))
                })
                .catch(r => reject(r))
        })
    }
}

// export