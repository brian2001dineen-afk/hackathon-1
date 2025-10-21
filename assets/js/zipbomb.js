const canv = document.querySelector("canvas");
const c = canv.getContext("2d");

canv.width = window.innerWidth;
canv.height = window.innerHeight;

// Framerate lock (default 60 FPS). Change with setTargetFPS(fps).
var targetFPS = 60,
    frameInterval = 1000 / targetFPS,
    lastFrameTime = 0;

class Boundary {
    static width = 30;
    static height = 30;
    constructor({ position }) {
        this.position = position;
        this.width = Boundary.width;
        this.height = Boundary.height;
    }

    draw() {
        c.fillStyle = "cyan";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
        this.color = "red";
    }

    center_x() {
        return this.x + Boundary.width / 2;
    }

    center_y() {
        return this.y + Boundary.height / 2;
    }

    draw() {
        c.beginPath();
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            Math.PI * 2,
            false
        );
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Enemy {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 4;
        this.color = "blue";
    }
    // Appearance/rendering
    draw() {
        c.beginPath();
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            Math.PI * 2,
            false
        );
        c.fillStyle = this.color;
        c.fill();
    }
    // How it updates each frame
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Coin {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
        this.color = "yellow";
    }
    // Appearance/rendering
    draw() {
        c.beginPath();
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            Math.PI * 2,
            false
        );
        c.fillStyle = this.color;
        c.fill();
    }
    // How it updates each frame
    update() {
        this.draw();
    }
}

// Implementation variables
let bound = [];
let enemies = [];
let coins = [];
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
        x: 0,
        y: 0,
    },
});

/**
 * Map key:
 * - 0: free space
 * - 1: wall
 * - 2: player spawn
 * - 3: enemy spawn
 * - 4: coin drop
 * - 5: victory zone
 */
const map = [
    [],
    // Level 1
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
];

// Map 2D coordinate translation helpers
function coordTranslator(j, i, centering) {
    // If true, centers the object on the coordinate grid.
    // Otherwise, places at upper LHS corner (default for walls).
    if (centering) {
        return {
            x: Boundary.width * j + Boundary.width / 2,
            y: Boundary.height * i + Boundary.height / 2,
        };
    } else {
        return {
            x: Boundary.width * j,
            y: Boundary.height * i,
        };
    }
}

// translate map array and create map boundaries
function renderLevel(lvl) {
    map[lvl].forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case 1:
                    // Place boundaries
                    bound.push(
                        new Boundary({
                            position: coordTranslator(j, i),
                        })
                    );
                    break;
                case 2:
                    // Place player
                    player.position = coordTranslator(j, i, true);
                case 3:
                    // Place enemies
                    enemies.push(
                        new Enemy({
                            position: coordTranslator(j, i, true),
                        })
                    );
                    break;
                case 4:
                    coins.push(
                        new Coin({
                            position: coordTranslator(j, i, true),
                        })
                    );
                // place coins
            }
        });
    });
}

renderLevel(1);

function checkColliding(collider) {
    let dx = player.center_x() - collider.center_x();
    let dy = player.center_y() - collider.center_y();

    if (
        player.position.y - player.radius <=
            collider.position.y + boundary.height &&
        player.position.x + player.radius >= boundary.position.x &&
        player.position.y + player.radius >= boundary.position.y &&
        player.position.x - player.radius <=
            boundary.position.x + boundary.width
    ) {
        console.log("collide");
    }
}

function animate() {
    c.clearRect(0, 0, canv.width, canv.height);
    bound.forEach((boundary) => {
        boundary.draw();
        player.update();
        // collision detection
    });
    enemies.forEach((enemy) => {
        enemy.draw();
    });
    requestAnimationFrame(animate);
}

// helper to change the target framerate at runtime
function settargetfps(fps) {
    if (typeof fps !== "number" || fps <= 0) return;
    targetfps = fps;
    frameinterval = 1000 / targetfps;
}

function collision(obstacle, enemy) {}

animate();

// Keypress tracking for multi-inputs
addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "k":
            player.position.y = player.position.y - Boundary.height;
            break;
        case "h":
            player.position.x = player.position.x - Boundary.width;
            break;
        case "j":
            player.position.y = player.position.y + Boundary.height;
            break;
        case "l":
            player.position.x = player.position.x + Boundary.width;
            break;
    }
});
