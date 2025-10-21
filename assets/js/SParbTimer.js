const timer = {
    time: 0,
    intervalId: null,
    /** Start timer counter */
    start() {
        this.seconds = 0;
        this.intervalId = setInterval(() => {
            this.time += 0.1; // 
            document.getElementById("timer").innerText = this.time.toFixed(2);
        }, 100);
    },
    /** Pause timer counter */
    stop() {
        clearInterval(this.intervalId);
    },

    /** Reset timer counter */
    reset() {
        this.stop();
        this.time = 0;
        document.getElementById("timer").innerText = this.time.toFixed(2);
    }
};