const game = {
    // Placeholder attributes incase the DOM hasn't finished loading
    canvas: document.querySelector("canvas"),
    state: document.getElementById("state"),
    c: null,
    canvasWidth: 0,
    canvasHeight: 0,
    difficulty: [ //speeds of cars at various difficulties
        [1, 4],
        [2, 6],
        [3, 8],
    ],
    difficultyIndex: 0, // Change difficulty level 0-2
    playerSpeed: 0.5,
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
    carsList: [], // Array where the cars on screen are stored
    player: {
        size: 30,
        step: 3,
        keys: {},
        colour: "blue",
        x: 0,
        y: 0,
        xStart: 0,
        yStart: 0,
        hit: false,
    },

    /** Initialize the game */
    init() {
        timer.start();
        this.carsList = []; // Reset carsList to empty
        this.playerSpeed = 0.5;
        this.c = this.canvas.getContext("2d");
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.player.xStart = this.canvasWidth / 2 - this.player.size / 2;
        this.player.yStart = this.canvasHeight - this.player.size - 20;
        this.player.x = this.player.xStart;
        this.player.y = this.player.yStart;
        this.carsList.push(this.createCar(0));
        this.loop();

        // Increase playerSpeed by 0.1 every 2 seconds
        if (this.speedInterval) clearInterval(this.speedInterval);
        this.speedInterval = setInterval(() => {
            if (this.playerSpeed < 4){ //speed cap
                this.playerSpeed += 0.05; 
            }    
        }, 1000);

        //listen for player inputs
        document.addEventListener("keydown", (event) => {
            this.player.keys[event.key] = true;
            // Listen for enter key to restart game after crash
            if (event.key === "Enter" && this.player.hit) {
                this.player.hit = false;
                this.state.innerText = "Running";
                timer.reset();
                game.init();
            }
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
        car.y += this.playerSpeed;
        if (car.x <= 0 - 200) {
            car.x = this.canvasWidth + this.getRandomNumber(160, 200);
        } else if (car.x >= this.canvasWidth + 200) {
            car.x = this.getRandomNumber(-160, -200);
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
            width: this.getRandomNumber(60, 100), // Random car length
            height: 40,
            speed:
                this.getRandomNumber(
                    this.difficulty[this.difficultyIndex][0],
                    this.difficulty[this.difficultyIndex][1]
                ) / 2, // Random car speed based on difficulty
            colour: this.carColours[Math.floor(Math.random() * 8)],
            direction: this.carDirections[this.getRandomNumber(0, 1)], //Random car direction
        };
    },

    /** The loop that keeps the game running */
    loop() {
        this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // Clear canvas once per frame for smoothness
        document.getElementById("speedElement").innerText = this.playerSpeed.toFixed(2);
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

        //Draw the assets with their updated position
        this.carsList.forEach((car) => this.drawCars(car));
        this.drawPlayer();

        // If player object gets hit by a car end the game
        if (this.player.hit) {
            this.deaths += 1;
            timer.stop();
            this.state.innerText = "Crashed! Press enter to restart.";
            //requestAnimationFrame(() => this.loop()); // God mode comment out to turn off
        } else {
            requestAnimationFrame(() => this.loop()); // Run the loop on every animation frame so everything looks more smooth
        }
    }
};

game.init(); // Start the game
