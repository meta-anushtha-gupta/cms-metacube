import { CLASSES } from 'Constants';

export default class Ajax {
    constructor(element) {
        this.element = element;
        this.http = new XMLHttpRequest();
        this.postAjax = new XMLHttpRequest();
        this.jsonPostAjax = new XMLHttpRequest();
        this.multiPartPostAjax = new XMLHttpRequest();
        this.deleteAjax = new XMLHttpRequest();
        this.init();
    }

    init() {
        this.cacheDOMElement();
    }

    cacheDOMElement() {
        this.accordionOpenElem = this.element.querySelector(`.${CLASSES.ACCORDION_OPEN}`);
    }

    readTextFile(file, callback) {
        this.http = new XMLHttpRequest();

        this.http.overrideMimeType('application/json');
        this.http.open('GET', file, true);
        this.http.onreadystatechange = () => {
            if (this.http.readyState === 4 && this.http.status === 200) {
                callback(this.http.responseText);
            }
        };
        this.http.send(null);
    }

    ajaxPostFn(url, data, success) {
        const params = typeof data === 'string' ? data : Object.keys(data).map(
                k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`
            ).join('&');
        this.postAjax.open('POST', url, true);
        this.postAjax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        this.postAjax.onreadystatechange = () => {
            if (this.postAjax.readyState === 4 && this.postAjax.status === 200) {
                success(this.postAjax.responseText);
            }
        };
        this.postAjax.send(params);
    }

    ajaxJsonPostFn(url, data, success) {
        const params = JSON.stringify(data);
        this.jsonPostAjax.open('POST', url, true);
        this.jsonPostAjax.setRequestHeader('Content-type', 'application/json');
        this.jsonPostAjax.onreadystatechange = () => {
            if (this.jsonPostAjax.readyState === 4 && this.jsonPostAjax.status === 200) {
                success(this.jsonPostAjax.responseText);
            }
        };
        this.jsonPostAjax.send(params);
    }

    ajaxMultipartPostFn(url, data, success) {
        this.multiPartPostAjax.open('POST', url, true);

        this.multiPartPostAjax.onreadystatechange = () => {
            if (this.multiPartPostAjax.readyState === 4 && this.multiPartPostAjax.status === 200) {
                success(this.multiPartPostAjax.responseText);
            }
        };
        this.multiPartPostAjax.send(data);
    }

    ajaxDeleteFn(url, data, success) {
        const params = JSON.stringify(data);
        this.deleteAjax.open('DELETE', url, true);
        this.deleteAjax.onload = () => {
            if (this.deleteAjax.readyState === 4 && this.deleteAjax.status === 200) {
                success(this.deleteAjax.responseText);
            }
        };
        this.deleteAjax.send(params);
    }
}
