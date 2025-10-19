const canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

// Square starting cooridinates
let x = 100;
let y = 100;

const size = 40; // Size of Square
const step = 1; // Speed of square
const keys = {};

// Circle starting coordinates
let circleX = 50;
let circleY = 200;
let circleRadius = 1;
let circleSpeed = 2;
let circleDirection = 1; // 1 = right, -1 = left

console.log(canvas);

/** Draw the square */ 
function drawSquare() {
    c.fillStyle = "blue";
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(Math.round(x), Math.round(y), size, size);
}

/** Update square position based on keys pressed */
function updateSquarePosition() {
    if (keys["ArrowUp"]) y -= step;
    if (keys["ArrowDown"]) y += step;
    if (keys["ArrowLeft"]) x -= step;
    if (keys["ArrowRight"]) x += step;
    // Clamp position to stay within canvas when step isnt divisible by the canvas dimentions
    x = Math.min(Math.max(x, 0), canvas.width - size);
    y = Math.min(Math.max(y, 0), canvas.height - size);
    // Update circle position
    circleX += circleSpeed * circleDirection;
    // Bounce off left/right edges
    if (circleX - circleRadius <= 50 || circleX + circleRadius >= canvas.width -50) {
        circleDirection *= -1;
    }
    drawSquare();
    drawCircle();
    requestAnimationFrame(updateSquarePosition);
}

//Listen for user key presses
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});
//Listen for key being released
document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

function drawCircle() {
    c.beginPath();
    c.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
    c.lineWidth = 30;
    c.strokeStyle = "red";
    c.stroke();
};

// Start loop
drawSquare();
drawCircle();
updateSquarePosition();
