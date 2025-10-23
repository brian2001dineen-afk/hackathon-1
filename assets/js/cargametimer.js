// Manages everything based on time (seconds)

// Pauses time and sounds when the user is tabbed out of the window
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        timer.stop();
        trafficSound.pause();
    } else if (!game.player.hit && !game.menu) {
        timer.start();
        trafficSound.play();
    }
});
const timer = {
    time: 0,
    roadScrollSpeed: 1, //Starting speed which the roads scroll downwards
    roadIncrement: 0.2, //Scrolling speed increase per second
    speedCap: 8, // Max scroll speed
    interval: null,
    /** Start timer counter */
    start() {
        this.seconds = 0;
        this.interval = setInterval(() => {
            this.time += 0.1;
        }, 100);
        if (this.speedInterval) clearInterval(this.speedInterval);
        this.speedInterval = setInterval(() => {
            if (this.roadScrollSpeed < this.speedCap - this.roadIncrement) {
                //speed cap
                this.roadScrollSpeed += this.roadIncrement;
            }
        }, 1000);
    },
    /** Pause timer counter */
    stop() {
        clearInterval(this.interval);
        clearInterval(this.speedInterval);
    },

    /** Reset timer counter */
    reset() {
        this.stop();
        this.time = 0;
        this.roadScrollSpeed = 1
    }
};