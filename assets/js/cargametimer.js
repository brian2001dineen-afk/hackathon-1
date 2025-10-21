const timer = {
    time: 0,
    interval: null,
    /** Start timer counter */
    start() {
        this.seconds = 0;
        this.interval = setInterval(() => {
            this.time += 0.1; // 
            document.getElementById("timerElement").innerText = this.time.toFixed(2);
        }, 100);
    },
    /** Pause timer counter */
    stop() {
        clearInterval(this.interval);
    },

    /** Reset timer counter */
    reset() {
        this.stop();
        this.time = 0;
        document.getElementById("timerElement").innerText = this.time.toFixed(2);
    }
};