const canvas = document.querySelector("canvas");
const crashesCounter = document.getElementById("crashes");
let c = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

deaths = 0;

const playerSize = 30; // Size of Player
const playerStep = 1; // Speed of Player
const playerKeys = {};
const playerColour = "blue";
let carsList = [];
let hit = false;

// Player starting cooridinates
const playerXStart = canvasWidth / 2 - playerSize / 2; // place player start in middle of screen
const playerYStart = canvasHeight - playerSize - 20; // place player start at bottom of screen
let playerX = playerXStart;
let playerY = playerYStart;

console.log(canvas);

/** Draw the player controlled object */
function drawPlayer() {
    c.fillStyle = playerColour;
    c.fillRect(
        Math.round(playerX),
        Math.round(playerY),
        playerSize,
        playerSize
    );
}

/** Draw the car objects and roads */
function drawCars(cars) {
    c.fillStyle = "gray";
    c.fillRect(0, Math.round(cars.y) -20, canvasWidth ,80);

    c.fillStyle = cars.colour; // Rectangle color
    c.fillRect(Math.round(cars.x), Math.round(cars.y), cars.width, cars.height); // x, y, width, height

}

/** Update player position based on keys pressed and car positions over time */
function updatePositions(cars) {
    c.clearRect(0, 0, canvasWidth, canvasHeight); // Clear canvas once per frame for smoothness

    //Make the player move when keys are pressed
    if (playerKeys["ArrowUp"]) playerY -= playerStep;
    if (playerKeys["ArrowDown"]) playerY += playerStep;
    if (playerKeys["ArrowLeft"]) playerX -= playerStep;
    if (playerKeys["ArrowRight"]) playerX += playerStep;

    // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
    playerX = Math.min(Math.max(playerX, 0), canvasWidth - playerSize);
    playerY = Math.min(Math.max(playerY, 0), canvasHeight - playerSize);

    cars.forEach((car) => updateCarPositions(car));
    cars.forEach((car) => checkCollision(car));

    if (hit) {
        deaths += 1
        crashesCounter.innerText = "Crashes: " + deaths;
        crashes
        playerX = playerXStart;
        playerY = playerYStart; // send player back to start
        hit = false;
    }

    //draw the assets
    cars.forEach((car) => drawCars(car));
    drawPlayer();
    requestAnimationFrame(() => updatePositions(cars)); //cause the cars too move more smoothly
}

/** Update cars position */
function updateCarPositions(car) {
    // Update car position
    car.x += car.speed * car.direction;
    //car.y += 0.6 // Make the roads move downwards
    // Bounce off left/right edges
    if (car.x <= 0 - 200 ) {
        car.x = canvasWidth + 200;
    } else if (car.x >= canvasWidth + 200){
        car.x = -200;
    }
}

/**Check if player collides with a car */
function checkCollision(cars) {
    if (
        playerX + playerSize >= cars.x &&
        playerX <= cars.x + cars.width &&
        playerY + playerSize >= cars.y &&
        playerY <= cars.y + cars.height
    ) {
        hit = true;
    }
}

//Listen for user key presses
document.addEventListener("keydown", (event) => {
    playerKeys[event.key] = true;
});
//Listen for key being released
document.addEventListener("keyup", (event) => {
    playerKeys[event.key] = false;
});

/** Create a car object */
function createCar(x, y, width, height, speed, colour, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.colour = colour;
    this.direction = direction;
}

const car1 = new createCar(canvasWidth, 100, 60, 40, 4, "red", -1);
carsList.push(car1);
const car2 = new createCar(0, 200, 80, 40, 2.5, "yellow", 1);
carsList.push(car2);
const car3 = new createCar(0, 300, 80, 40, 3, "green", 1);
carsList.push(car3);
const car4 = new createCar(canvasWidth, 400, 100, 40, 2, "purple", -1);
carsList.push(car4);

// Start game loop
carsList.forEach((car) => drawCars(car));
drawPlayer();
updatePositions(carsList);
