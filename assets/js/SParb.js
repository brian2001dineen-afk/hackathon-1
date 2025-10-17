const canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

let x = 100;
let y = 100;
const size = 20;
const step = 1.4; // Smaller step for smoother movement

const keys = {};

// Draw the square
function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(Math.round(x), Math.round(y), size, size);
}

// Update position based on keys pressed
function update() {
    if (keys["ArrowUp"]) y -= step;
    if (keys["ArrowDown"]) y += step;
    if (keys["ArrowLeft"]) x -= step;
    if (keys["ArrowRight"]) x += step;
    // Clamp position to stay within canvas
    x = Math.min(Math.max(x, 0), canvas.width - size);
    y = Math.min(Math.max(y, 0), canvas.height - size);
    draw();
    requestAnimationFrame(update);
}

// Listen for key presses
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// Start animation loop
draw();
update();

console.log(canvas);
