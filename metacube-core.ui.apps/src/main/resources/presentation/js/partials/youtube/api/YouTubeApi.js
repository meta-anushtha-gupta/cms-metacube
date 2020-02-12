let isYoutubeAPILoaded = false;
let instance = null;

class YoutubeVideoAPI {
    constructor() {
        if (!instance) {
            instance = this;
        }

        return this.init();
    }

    loadScript() {
        if (!isYoutubeAPILoaded) {
            const ytScript = window.document.createElement('script');
            ytScript.src = 'https://www.youtube.com/iframe_api';
            ytScript.onload = () => {
                isYoutubeAPILoaded = true;
            };
            window.document.getElementsByTagName('head')[0].appendChild(ytScript);
        }

        return this;
    }

    init() {
        this.loadScript();

        return new Promise((resolve) => {
            if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
                resolve(window.YT);

                return;
            }

            const previous = window.onYouTubeIframeAPIReady;

            window.onYouTubeIframeAPIReady = () => {
                if (previous) {
                    previous();
                }

                resolve(window.YT);
            };
        });
    }
}

export default YoutubeVideoAPI;
