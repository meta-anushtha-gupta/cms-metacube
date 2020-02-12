import AnalyticsApi from 'partials/analytics';

class YouTubeAnalyticsApi extends AnalyticsApi {
    constructor(videoTitle, videoId) {
        super('satellite');
        this.player = null;
        this.videoTitle = videoTitle;
        this.videoId = videoId;
        this.progressInterval = null;
        this.wasPaused = false;
        this.progressReported = {
            25: false,
            50: false,
            75: false
        };
    }

    /**
     * @method logVideoEvent
     * @description Call logEvent with videoTrack data
     */
    logVideoEvent(videoEvent) {
        this.logEvent('videoTrack', {
            videoTitle: this.videoTitle,
            videoId: this.videoId,
            videoEvent
        });
    }

    /**
     * @method handleStateChange
     * @description Callback handler to manage analytics events based on the event state
     * @param event {Event} Event object triggered from YouTube player
     */
    handleStateChange(event) {
        const isStarted = event.data === window.YT.PlayerState.UNSTARTED;
        const isPlaying = event.data === window.YT.PlayerState.PLAYING;
        const isPaused = event.data === window.YT.PlayerState.PAUSED;
        const isEnded = event.data === window.YT.PlayerState.ENDED;
        this.player = event.target;
        if (isStarted) {
            this.progressInterval = window.setInterval(this.calcProgress.bind(this), 250);
            this.start();
        }
        if (isPaused) {
            this.wasPaused = true;
        }
        if (isPlaying) {
            if (this.wasPaused) {
                this.wasPaused = false;
                this.resume();
            } else {
                this.play();
            }
        }
        if (isEnded) {
            window.clearInterval(this.progressInterval);
            this.complete();
        }
    }

    /**
     * @method
     * @description Calculate percentage of video played and call
     * percentagePlayed method if it is 25%, 50% or 75%
     */
    calcProgress() {
        const currentTime = this.player.getCurrentTime();
        const duration = this.player.getDuration();
        const percentage = Math.round(100 * (currentTime / duration));
        if (percentage !== 0 && percentage % 25 === 0) {
            if (!this.progressReported[percentage]) {
                this.progressReported[percentage] = true;
                this.percentagePlayed(percentage);
            }
        }
    }

    /**
     * @method
     * @description log video start
     */
    start() {
        console.log('start, video start');
        this.logVideoEvent('video start');
    }

    /**
    * @method
    * @description log video play
    */
    play() {
        console.log('play, video play');
        this.logVideoEvent('video play');
    }

    /**
    * @method
    * @description log video resume
    */
    resume() {
        console.log('resume, video resume');
        this.logVideoEvent('video resume');
    }

    /**
    * @method
    * @description log video % played
    * @param {Int} percentage - the percentage that's been played
    */
    percentagePlayed(percentage) {
        if (percentage !== 100) {
            console.log(`${percentage}% played, video ${percentage}% played`);
            this.logVideoEvent(`video ${percentage}% played`);
        }
    }

    /**
    * @method
    * @description log video completed
    */
    complete() {
        console.log('complete, video complete');
        this.logVideoEvent('video complete');
    }
}

export default YouTubeAnalyticsApi;
