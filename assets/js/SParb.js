const canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const playerSize = 30; // Size of Player
const playerStep = 1; // Speed of Player
const playerKeys = {};
const playerColour = "blue"
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

/** Draw the car objects */
function drawCars(cars) {
    c.fillStyle = cars.colour; // Rectangle color
    c.fillRect(Math.round(cars.x), Math.round(cars.y), cars.width, cars.height); // x, y, width, height
}

/** Update player position based on keys pressed and car positions over time */
function updatePositions(cars) {

    c.clearRect(0, 0, canvasWidth, canvasHeight); // Clear canvas once per frame for smoothness
    if (playerKeys["ArrowUp"]) playerY -= playerStep;
    if (playerKeys["ArrowDown"]) playerY += playerStep;
    if (playerKeys["ArrowLeft"]) playerX -= playerStep;
    if (playerKeys["ArrowRight"]) playerX += playerStep;
    // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
    playerX = Math.min(Math.max(playerX, 0), canvasWidth - playerSize);
    playerY = Math.min(Math.max(playerY, 0), canvasHeight - playerSize);

    cars.forEach((car) => checkCollision(car)) 
    if (hit){
        playerX = playerXStart;
        playerY = playerYStart; // send player back to start
        hit = false;
    }
    drawPlayer();
    cars.forEach((car) => updateCarPositions(car));
    cars.forEach((car) => drawCars(car));

    requestAnimationFrame(() => updatePositions(cars));
      
}

/** Update cars position */
function updateCarPositions(car) {
    // Update car position
    car.x += car.speed * car.direction;
    // Bounce off left/right edges
    if (car.x <= 0 + 30 || car.x >= canvasWidth - car.width - 30) {
        car.direction *= -1;
    }
}

/**Check if player collides with a car */
function checkCollision(cars) {
    if (playerX + playerSize >= cars.x && 
        playerX <= cars.x +cars.width &&
        playerY + playerSize >= cars.y &&
        playerY <= cars.y + cars.height) {
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
function createCar(x, y, width, height, speed, colour) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.colour = colour;
    this.direction = 1;
}

const car1 = new createCar(50, 100, 80, 40, 2, "red");
carsList.push(car1);
const car2 = new createCar(150, 200, 60, 40, 3, "yellow");
carsList.push(car2);
const car3 = new createCar(150, 300, 80, 40, 2.5, "green");
carsList.push(car3);

// Start game loops
drawPlayer();
carsList.forEach((car) => drawCars(car));
updatePositions(carsList);
