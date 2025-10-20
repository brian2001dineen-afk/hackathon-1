const canvas = document.querySelector("canvas");
const crashesCounter = document.getElementById("crashes");
let c = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let deaths = 0;
const carColours = [
    "red",
    "cyan",
    "yellow",
    "green",
    "purple",
    "orange",
    "white",
    "black",
];
const carDirections = [1, -1];

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

/** Update player position based on keys pressed and car positions over time */
function updatePositions() {
    c.clearRect(0, 0, canvasWidth, canvasHeight); // Clear canvas once per frame for smoothness

    //Make the player move when keys are pressed
    if (playerKeys["ArrowUp"]) playerY -= playerStep;
    if (playerKeys["ArrowDown"]) playerY += playerStep;
    if (playerKeys["ArrowLeft"]) playerX -= playerStep;
    if (playerKeys["ArrowRight"]) playerX += playerStep;

    // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
    playerX = Math.min(Math.max(playerX, 0), canvasWidth - playerSize);
    playerY = Math.min(Math.max(playerY, 0), canvasHeight - playerSize);

    carsList.forEach((car) => updateCarPositions(car));
    carsList = carsList.filter(car => car.y < canvasHeight + car.height); // delete cars and roads when they go offscreen
    addNewCar(); // add a new car at the top of the page if there is space
    carsList.forEach((car) => checkCollision(car));
    if (hit) {
        deaths += 1;
        crashesCounter.innerText = "Crashes: " + deaths;
        crashes;
        playerX = playerXStart;
        playerY = playerYStart; // send player back to start
        hit = false;
    }
    //draw the assets
    carsList.forEach((car) => drawCars(car));
    drawPlayer();
    requestAnimationFrame(() => updatePositions()); //cause the cars too move more smoothly
}

/** Draw the car objects and roads */
function drawCars(cars) {
    c.fillStyle = "gray";
    c.fillRect(0, Math.round(cars.y) - 20, canvasWidth, 80);

    c.fillStyle = cars.colour; // Rectangle color
    c.fillRect(Math.round(cars.x), Math.round(cars.y), cars.width, cars.height); // x, y, width, height
}

/** Update cars position */
function updateCarPositions(car) {
    // Update car position
    car.x += car.speed * car.direction;
    car.y += 0.5 // Make the roads move downwards
    // Make a car loop back onto the canvas if it drives off it
    if (car.x <= 0 - 200) {
        car.x = canvasWidth + 200;
    } else if (car.x >= canvasWidth + 200) {
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

/**Add a new card and road at the top if there is space */
function addNewCar() {
    const threshold = 40;
    const carNearTop = carsList.some(car => car.y < threshold);
    if (!carNearTop) {
        const newCar = new createCar(-60); // Start just above the canvas
        carsList.push(newCar);
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

/** Return a random number between 2 integers */
function getRandomNumber(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

/** Create a car object */
function createCar(y) {
    this.x = Math.random() * canvasWidth;
    this.y = y;
    this.width = getRandomNumber(60, 100);
    this.height = 40;
    this.speed = getRandomNumber(2, 8) / 2;
    this.colour = carColours[Math.floor(Math.random() * 8)];
    this.direction = carDirections[getRandomNumber(0, 1)];
}

const car1 = new createCar(400);
carsList.push(car1);
const car2 = new createCar(300);
carsList.push(car2);
const car3 = new createCar(200);
carsList.push(car3);
const car4 = new createCar(100);
carsList.push(car4);
const car5 = new createCar(0);
carsList.push(car5);

// Start game loop
carsList.forEach((car) => drawCars(car));
drawPlayer();
updatePositions();
