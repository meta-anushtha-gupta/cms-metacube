import { noop } from 'utils';
import YoutubeVideoAPI from '../api/YouTubeApi';

const defaultPlayerVars = {
    rel: 0,
    wmode: 'transparent',
    modestbranding: 1,
    showinfo: 0,
    origin: `//${window.document.domain}`,
    iv_load_policy: 3
};

class YouTube {
    constructor(videoId, placeholder, callback, playerVars = {}) {
        this.videoId = videoId;
        this.videoTitle = '';
        this.placeholder = placeholder;
        this.callback = callback;
        this.API = null;
        this.analyticsAPI = null;
        this.player = null;

        this.playerVars = {
            ...defaultPlayerVars,
            ...playerVars
        };

        this.promise = new YoutubeVideoAPI()
            .then((API) => {
                this.API = API;
            })
            .then(this.initializeVideoPlayer.bind(this));
    }

    isPlayerReady() {
        return this.player && typeof this.player.playVideo === 'function';
    }

    initializeVideoPlayer() {
        this.player = new this.API.Player(this.placeholder, {
            videoId: this.videoId,
            playerVars: this.playerVars
        });
        return this.player;
    }

    /**
     * When the returned player instance is not required, use this static method to
     * create a new instance.
     *
     * @param {string} videoId - Youtube identifier for the video
     * @param {Element} placeholder - Element into which the iframe is embedded
     * @param {function} [callback] - Callback function
     */
    static createInstance(videoId, placeholder, callback = noop, playerVars = {}) {
        return new this(videoId, placeholder, callback, playerVars);
    }
}

export default YouTube;
