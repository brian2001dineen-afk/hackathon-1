const game = {
    // Placeholder attributes incase the DOM hasn't finished loading
    canvas: document.querySelector("canvas"),
    crashesCounter: document.getElementById("crashes"),
    c: null,
    canvasWidth: 0,
    canvasHeight: 0,
    deaths: 0,
    carColours: [
        "red",
        "cyan",
        "yellow",
        "green",
        "purple",
        "orange",
        "white",
        "black",
    ],
    carDirections: [1, -1],
    player: {
        size: 30,
        step: 1,
        keys: {},
        colour: "blue",
        x: 0,
        y: 0,
        xStart: 0,
        yStart: 0,
        hit: false,
    },
    carsList: [], // Array where the cars on screen are stored

    /** Initialize the game */
    init() {
        this.c = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.player.xStart = this.canvasWidth / 2 - this.player.size / 2;
        this.player.yStart = this.canvasHeight - this.player.size - 20;
        this.player.x = this.player.xStart;
        this.player.y = this.player.yStart;
        this.carsList.push(this.createCar(0));
        this.loop();
        document.addEventListener("keydown", (event) => {
            this.player.keys[event.key] = true;
        });
        document.addEventListener("keyup", (event) => {
            this.player.keys[event.key] = false;
        });
    },

    /** Draw the player controlled object */
    drawPlayer() {
        this.c.fillStyle = this.player.colour;
        this.c.fillRect(
            Math.round(this.player.x),
            Math.round(this.player.y),
            this.player.size,
            this.player.size
        );
    },

    /** Draw the car objects and roads */
    drawCars(car) {
        //Draw the road
        this.c.fillStyle = "#828282";
        this.c.fillRect(
            0,
            Math.round(car.y) - car.height / 2,
            this.canvasWidth,
            car.height * 2
        );
        //Draw the car on the road
        this.c.fillStyle = car.colour;
        this.c.fillRect(
            Math.round(car.x),
            Math.round(car.y),
            car.width,
            car.height
        );
    },

    /** Update cars position on the next frame*/
    updateCarPositions(car) {
        car.x += car.speed * car.direction;
        car.y += 0.5;
        if (car.x <= 0 - 200) {
            car.x = this.canvasWidth + 200;
        } else if (car.x >= this.canvasWidth + 200) {
            car.x = -200;
        }
    },

    /**Check if player collides with a car */
    checkCollision(car) {
        if (
            this.player.x + this.player.size >= car.x &&
            this.player.x <= car.x + car.width &&
            this.player.y + this.player.size >= car.y &&
            this.player.y <= car.y + car.height
        ) {
            this.player.hit = true;
        }
    },

    /** Check to see if a new car needs to be added once there is space at the top*/
    addNewCar() {
        const grassWidth = 40;
        const carNearTop = this.carsList.some((car) => car.y < grassWidth);
        if (!carNearTop) {
            this.carsList.push(this.createCar(-60));
        }
    },

    /** Return a random number between 2 integers */
    getRandomNumber(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(
            Math.random() * (maxFloored - minCeiled + 1) + minCeiled
        );
    },

    /** Create a car object */
    createCar(y) {
        return {
            x: Math.random() * this.canvasWidth,
            y: y,
            width: this.getRandomNumber(60, 100),
            height: 40,
            speed: this.getRandomNumber(2, 8) / 2,
            colour: this.carColours[Math.floor(Math.random() * 8)],
            direction: this.carDirections[this.getRandomNumber(0, 1)],
        };
    },

    /** The loop that keeps the game running */
    loop() {
        this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // Clear canvas once per frame for smoothness

        // Player movement when arrows keys are pressed
        if (this.player.keys["ArrowUp"]) this.player.y -= this.player.step;
        if (this.player.keys["ArrowDown"]) this.player.y += this.player.step;
        if (this.player.keys["ArrowLeft"]) this.player.x -= this.player.step;
        if (this.player.keys["ArrowRight"]) this.player.x += this.player.step;

        // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
        this.player.x = Math.min(
            Math.max(this.player.x, 0),
            this.canvasWidth - this.player.size
        );
        this.player.y = Math.min(
            Math.max(this.player.y, 0),
            this.canvasHeight - this.player.size
        );

        // Update cars position and if new cars needs to be added or old ones off screen deleted
        this.carsList.forEach((car) => this.updateCarPositions(car));
        this.carsList = this.carsList.filter(
            (car) => car.y < this.canvasHeight + car.height
        );
        this.addNewCar();
        this.carsList.forEach((car) => this.checkCollision(car));

        // If player object gets hit by a car
        if (this.player.hit) {
            this.deaths += 1;
            this.crashesCounter.innerText = "Crashes: " + this.deaths;
            this.player.x = this.player.xStart;
            this.player.y = this.player.yStart;
            this.player.hit = false;
        }

        //Draw the assets with their updated position
        this.carsList.forEach((car) => this.drawCars(car));
        this.drawPlayer();
        requestAnimationFrame(() => this.loop()); // Run the loop on every animation frame so everything looks more smooth
    },
};

game.init(); // Start the game
