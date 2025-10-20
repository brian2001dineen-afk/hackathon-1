const canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const playerSize = 40; // Size of Square
const playerStep = 1; // Speed of square
const playerKeys = {};
let carsList = [];

// Square starting cooridinates
let x = (canvasWidth / 2) - (playerSize / 2);  // place player start in middle of screen
let y = canvasHeight - playerSize - 10; // place player start at bottom of screen

console.log(canvas);

/** Draw the player controlled object */ 
function drawSquare() {
    c.fillStyle = "blue";
    c.clearRect(0, 0, canvasWidth, canvasHeight);
    c.fillRect(Math.round(x), Math.round(y), playerSize, playerSize);
}

/** Update square position based on keys pressed */
function updatePositions(cars) {
    if (playerKeys["ArrowUp"]) y -= playerStep;
    if (playerKeys["ArrowDown"]) y += playerStep;
    if (playerKeys["ArrowLeft"]) x -= playerStep;
    if (playerKeys["ArrowRight"]) x += playerStep;
    // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
    x = Math.min(Math.max(x, 0), canvasWidth - playerSize);
    y = Math.min(Math.max(y, 0), canvasHeight - playerSize);

    cars.forEach((car) => updateCarPositions(car));
    drawSquare();
    cars.forEach((car) => drawCars(car));
    requestAnimationFrame(() => updatePositions(cars));
}

function updateCarPositions(car) {
    // Update car position
    car.x += car.speed * car.direction;
    // Bounce off left/right edges
    if (car.x <= 0 + 30 || car.x >= canvasWidth - car.width - 30) {
        car.direction *= -1;
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

/** Draw the car objects */
function drawCars(cars) {
    c.fillStyle = cars.colour; // Rectangle color
    c.fillRect(cars.x, cars.y, cars.width, cars.height); // x, y, width, height
};

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

// Start loop
drawSquare();
carsList.forEach((car) => drawCars(car));
updatePositions(carsList);
