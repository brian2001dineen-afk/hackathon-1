const canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const playerSize = 40; // Size of Player
const playerStep = 1; // Speed of Player
const playerKeys = {};
let carsList = [];

// Player starting cooridinates
let playerX = (canvasWidth / 2) - (playerSize / 2);  // place player start in middle of screen
let playerY = canvasHeight - playerSize - 10; // place player start at bottom of screen

console.log(canvas);

/** Draw the player controlled object */ 
function drawPlayer() {
    c.fillStyle = "blue";
    c.clearRect(0, 0, canvasWidth, canvasHeight);
    c.fillRect(Math.round(playerX), Math.round(playerY), playerSize, playerSize);
}

/** Draw the car objects */
function drawCars(cars) {
    c.fillStyle = cars.colour; // Rectangle color
    c.fillRect(cars.x, cars.y, cars.width, cars.height); // x, y, width, height
};

/** Update player position based on keys pressed and car positions over time */
function updatePositions(cars) {
    if (playerKeys["ArrowUp"]) playerY -= playerStep;
    if (playerKeys["ArrowDown"]) playerY += playerStep;
    if (playerKeys["ArrowLeft"]) playerX -= playerStep;
    if (playerKeys["ArrowRight"]) playerX += playerStep;
    // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
    playerX = Math.min(Math.max(playerX, 0), canvasWidth - playerSize);
    playerY = Math.min(Math.max(playerY, 0), canvasHeight - playerSize);

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

function checkCollision(cars) {
    
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
};

const car1 = new createCar(50, 200, 60, 40, 2, "red")
carsList.push(car1)
const car2 = new createCar(150, 300, 60, 40, 3, "green")
carsList.push(car2)

// Start game loops
drawPlayer();
carsList.forEach((car) => drawCars(car));
updatePositions(carsList);
