function main() {
    const crashSound = new Audio("assets/cargameAssets/carCrash.mp3");
    const trafficSound = new Audio("assets/cargameAssets/traffic.mp3");
    const grassImg = new Image();
    grassImg.src = "assets/cargameAssets/grass.png";
    const menuCar = new Image();
    menuCar.src = "assets/cargameAssets/menuCar.png";
    const game = {
        // Placeholder attributes incase the DOM hasn't finished loading change attributes in init for testing
        canvas: document.querySelector("canvas"),
        c: null,
        canvasWidth: 0,
        canvasHeight: 0,
        backgroundY: 0,
        menu: true,
        difficulty: [
            //speeds of cars at various difficulties
            [2, 4],
            [4, 8],
            [6, 12],
        ],
        difficultyIndex: 2, // Change difficulty level 0-2
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
            size: 40, //Player size
            step: 4, //Player speed
            keys: {},
            colour: "blue",
            x: 0,
            y: 0,
            xStart: 0,
            yStart: 0,
            hit: false,
        },
        //Main menu screen
        menu() {
            this.c = this.canvas.getContext("2d");
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;

            menuCar.onload = () => {
                this.c.drawImage(
                    menuCar,
                    this.canvasWidth / 2 - 100,
                    100,
                    200,
                    100
                );
            };

            //Draw menu text
            this.c.fillStyle = "black";
            this.c.font = "70px Bungee";
            const menuTitle = "Car Crosser";
            const textWidth = this.c.measureText(menuTitle).width;
            this.c.fillText(
                menuTitle,
                (this.canvasWidth - textWidth) / 2,
                this.canvasHeight / 2 - 50
            );
            this.c.font = "30px Bungee";
            const menuInstructions1 = "Use W,A,S,D to move your car";
            const textWidth2 = this.c.measureText(menuInstructions1).width;
            this.c.fillText(
                menuInstructions1,
                (this.canvasWidth - textWidth2) / 2,
                this.canvasHeight / 2 + 20
            );
            this.c.font = "30px Bungee";
            const menuInstructions2 = "Press enter to start";
            const textWidth3 = this.c.measureText(menuInstructions2).width;
            this.c.fillText(
                menuInstructions2,
                (this.canvasWidth - textWidth3) / 2,
                this.canvasHeight / 2 + 90
            );

            document.addEventListener("keypress", (event) => {
                if (event.key === "Enter" && this.menu) {
                    trafficSound.currentTime = 0;
                    trafficSound.volume = 0.5;
                    trafficSound.play();
                    this.init();
                }
            });
        },

        /** Initialize the game change attributes here for testing*/
        init() {
            this.menu = false;
            this.carsList = []; // Reset carsList to empty
            this.c = this.canvas.getContext("2d");
            this.canvasWidth = this.canvas.width;
            this.canvasHeight = this.canvas.height;
            this.player.xStart = this.canvasWidth / 2 - this.player.size / 2;
            this.player.yStart = this.canvasHeight - this.player.size - 60;
            this.player.x = this.player.xStart;
            this.player.y = this.player.yStart;
            this.carsList.push(this.createCar(0));
            timer.start();
            this.loop();

            //listen for player inputs
            document.addEventListener("keydown", (event) => {
                this.player.keys[event.key] = true;
                // Listen for enter key to restart game after crash
                if (event.key === "r" && this.player.hit) {
                    this.player.hit = false;
                    trafficSound.currentTime = 0;
                    trafficSound.play();
                    timer.reset();
                    game.init();
                }
            });
            document.addEventListener("keyup", (event) => {
                this.player.keys[event.key] = false;
            });
        },

        drawGrass() {
            // Scroll the background in sync with the road
            this.backgroundY += timer.roadScrollSpeed;
            if (this.backgroundY >= grassImg.height) {
                this.backgroundY = 0;
            }

            // Draw the grass background
            if (grassImg.complete) {
                // Tile the image until the canvas is filled
                for (
                    let y = this.backgroundY - grassImg.height;
                    y < this.canvasHeight;
                    y += grassImg.height
                ) {
                    this.c.drawImage(
                        grassImg,
                        0,
                        y,
                        this.canvasWidth,
                        grassImg.height
                    );
                }
            } else {
                // Colour if image not loaded
                this.c.fillStyle = "lightgreen";
                this.c.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            }
        },

        /** Draw players speed and time*/
        drawStats() {
            //Draw stat background
            this.c.fillStyle = "rgba(255,255,255,0.5)";
            this.c.fillRect(0, this.canvasHeight - 25, this.canvasWidth, 25);

            //Draw stats text
            this.c.fillStyle = "black";
            this.c.font = "20px Bungee";
            const time = "Time: " + timer.time.toFixed(2);
            const textWidth1 = this.c.measureText(time).width;
            this.c.fillText(
                time,
                this.canvasWidth - textWidth1 - 10,
                this.canvasHeight - 5
            );
            this.c.fillStyle = "black";
            this.c.font = "20px Bungee";
            const speed =
                "Speed: " +
                timer.roadScrollSpeed.toFixed(2) +
                "/" +
                timer.speedCap.toFixed(2);
            const textWidth2 = this.c.measureText(speed).width;
            this.c.fillText(speed, 10, this.canvasHeight - 5);
        },

        /** Draw the player controlled object */
        drawPlayer() {
            this.c.strokeStyle = this.player.colour;
            this.c.fillStyle = this.player.colour;
            this.c.beginPath();
            this.c.roundRect(
                Math.round(this.player.x),
                Math.round(this.player.y),
                this.player.size,
                this.player.size * 1.5,
                [5, 5, 2, 2]
            );
            this.c.fill();

            this.c.strokeStyle = "black";
            this.c.fillStyle = "black";
            this.c.beginPath();
            this.c.roundRect(
                Math.round(this.player.x) + 5,
                Math.round(this.player.y) + 5,
                this.player.size - 10,
                this.player.size / 3,
                [10, 10, 4, 4]
            );
            this.c.fill();
        },

        /** Draw the car objects and roads */
        drawCars(car) {
            //Draw the road
            this.c.fillStyle = "#5c5c5cff";
            this.c.fillRect(
                0,
                Math.round(car.y) - car.height / 2,
                this.canvasWidth,
                car.height * 2
            );
            // Draw road dashed borders
            this.c.setLineDash([40, 10]); // dashLength, gapLength
            this.c.strokeStyle = "white";
            this.c.lineWidth = 3;
            this.c.strokeRect(
                -10,
                Math.round(car.y) - car.height / 2,
                this.canvasWidth + 20,
                car.height * 2
            );
            this.c.setLineDash([]);

            //Draw the car on the road
            const direction = car.direction == -1 ? [5, 2, 2, 5] : [2, 5, 5, 2];

            this.c.strokeStyle = car.colour;
            this.c.fillStyle = car.colour;
            this.c.beginPath();
            this.c.roundRect(
                Math.round(car.x),
                Math.round(car.y),
                car.width,
                car.height,
                direction
            );
            this.c.fill();

            //Draw car windscreen
            this.c.strokeStyle = car.colour;
            this.c.fillStyle = car.colour == "black" ? "#022532" : "black";
            this.c.beginPath();
            if (car.direction === -1) {
                this.c.roundRect(
                    Math.round(car.x) + 5,
                    Math.round(car.y) + 5,
                    car.width / 4,
                    car.height - 10,
                    [10, 4, 4, 10]
                );
            } else {
                this.c.roundRect(
                    Math.round(car.x) + car.width * 0.75 - 5,
                    Math.round(car.y) + 5,
                    car.width / 4,
                    car.height - 10,
                    [4, 10, 10, 4]
                );
            }
            this.c.fill();
        },

        /** Update cars position on the next frame*/
        updateCarPositions(car) {
            car.x += car.speed * car.direction;
            car.y += timer.roadScrollSpeed;
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
                this.player.y + this.player.size * 1.5 >= car.y &&
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

        /** Loop that keeps the game running */
        loop() {
            this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // Clear canvas once per frame for smoothness

            // Player movement when arrows keys are pressed
            if (this.player.keys["w"]) {
                this.player.y -= this.player.step;
            }
            if (this.player.keys["s"]) {
                this.player.y += this.player.step;
            }
            if (this.player.keys["a"]) {
                this.player.x -= this.player.step;
            }
            if (this.player.keys["d"]) {
                this.player.x += this.player.step;
            }

            // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
            this.player.x = Math.min(
                Math.max(this.player.x, 0),
                this.canvasWidth - this.player.size
            );
            this.player.y = Math.min(
                Math.max(this.player.y, 0),
                this.canvasHeight - this.player.size * 1.5
            );
            this.drawGrass(); // Draw the scrolling grass background
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
            this.drawStats();

            // If player object gets hit by a car end the game
            if (this.player.hit) {
                //requestAnimationFrame(() => this.loop()); // God mode comment out to turn off

                //Play crash sound and pause the traffic sound
                crashSound.currentTime = 0;
                crashSound.volume = 0.3;
                crashSound.play();
                trafficSound.pause();

                //Place explosion image on player and show game over screen
                const explosion = new Image();
                explosion.src = "assets/cargameAssets/explosion.png";
                explosion.onload = () => {
                    this.c.drawImage(
                        explosion,
                        game.player.x - 20,
                        game.player.y - 20,
                        game.player.size * 2,
                        game.player.size * 2
                    );
                    this.c.fillStyle = "rgba(203, 91, 91, 0.7)";
                    this.c.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

                    this.c.fillStyle = "red";
                    this.c.font = "70px Bungee";
                    const gameOverMessage = "OH NO!";
                    const textWidth = this.c.measureText(gameOverMessage).width;
                    this.c.fillText(
                        gameOverMessage,
                        (this.canvasWidth - textWidth) / 2,
                        this.canvasHeight / 2 - 50
                    );
                    this.c.font = "30px Bungee";
                    const gameOverMessage2 =
                        "You drove for: " + timer.time.toFixed(2) + " seconds";
                    const textWidth2 =
                        this.c.measureText(gameOverMessage2).width;
                    this.c.fillText(
                        gameOverMessage2,
                        (this.canvasWidth - textWidth2) / 2,
                        this.canvasHeight / 2 + 20
                    );
                    this.c.font = "30px Bungee";
                    const gameOverMessage3 = "Press r to restart";
                    const textWidth3 =
                        this.c.measureText(gameOverMessage3).width;
                    this.c.fillText(
                        gameOverMessage3,
                        (this.canvasWidth - textWidth3) / 2,
                        this.canvasHeight / 2 + 90
                    );
                };
                timer.stop();
            } else {
                //If not hit run game as normal
                requestAnimationFrame(() => this.loop()); // Run the loop on every animation frame so everything looks more smooth
            }
        },
    };

    game.menu(); // Start the game
}
document.fonts.ready.then(() => {
    main(); // Draw menu only after fonts are loaded
});
