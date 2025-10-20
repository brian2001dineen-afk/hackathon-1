const canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const playerSize = 40; // Size of Square
const playerStep = 1; // Speed of square
const playerKeys = {};

// Square starting cooridinates
let x = (canvasWidth / 2) - (playerSize / 2);  // place player start in middle of screen
let y = canvasHeight - playerSize - 10; // place player start at bottom of screen

// Car starting coordinates
let carX = 50;
let carY = 200;
let carWidth = 60;
let carHeight = 40;
let carSpeed = 2;
let carDirection = 1; // 1 = right, -1 = left

console.log(canvas);

/** Draw the square */ 
function drawSquare() {
    c.fillStyle = "blue";
    c.clearRect(0, 0, canvasWidth, canvasHeight);
    c.fillRect(Math.round(x), Math.round(y), playerSize, playerSize);
}

/** Update square position based on keys pressed */
function updateSquarePosition() {
    if (playerKeys["ArrowUp"]) y -= playerStep;
    if (playerKeys["ArrowDown"]) y += playerStep;
    if (playerKeys["ArrowLeft"]) x -= playerStep;
    if (playerKeys["ArrowRight"]) x += playerStep;
    // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
    x = Math.min(Math.max(x, 0), canvasWidth - playerSize);
    y = Math.min(Math.max(y, 0), canvasHeight - playerSize);
    // Update car position
    carX += carSpeed * carDirection;
    // Bounce off left/right edges
    if (carX <= 0 + 30 || carX >= canvasWidth - carWidth - 30) {
        carDirection *= -1;
    }
    drawSquare();
    drawCar();
    requestAnimationFrame(updateSquarePosition);
}

//Listen for user key presses
document.addEventListener("keydown", (event) => {
    playerKeys[event.key] = true;
});
//Listen for key being released
document.addEventListener("keyup", (event) => {
    playerKeys[event.key] = false;
});

function drawCar() {
    c.fillStyle = "green"; // Rectangle color
    c.fillRect(carX, carY, carWidth, carHeight); // x, y, width, height
};

// Start loop
drawSquare();
drawCar();
updateSquarePosition();
