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
        // player is drawn at its center already
        return this.position.x;
    }

    center_y() {
        // player is drawn at its center already
        return this.position.y;
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
let currentLevel = 1; // active level index
let playerSpawn = null; // spawn position for respawn
let score = 0;
let won = false;
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
        [1, 2, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 1],
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
    // reset state for level
    bound = [];
    enemies = [];
    coins = [];
    playerSpawn = null;
    won = false;
    currentLevel = lvl;

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
                    // Place player and record spawn
                    player.position = coordTranslator(j, i, true);
                    playerSpawn = { ...player.position };
                    break;
                case 3:
                    // Place enemies
                    enemies.push(
                        new Enemy({
                            position: coordTranslator(j, i, true),
                        })
                    );
                    break;
                case 4:
                    // Place coins
                    coins.push(
                        new Coin({
                            position: coordTranslator(j, i, true),
                        })
                    );
                    break;
                case 5:
                    // Victory zone tile; no object needed, handled via logic
                    break;
            }
        });
    });
    if (playerSpawn === null) {
        console.log(
            "No playerSpawn found in level. Did you forget to place one?"
        );
        throw new Error("No playerSpawn detected. Aborting.");
    }
}

// For testing, render the first level
renderLevel(currentLevel);

// Determine if a given map cell is a wall (1) or out of bounds
function isWallAtCell(cellX, cellY) {
    const level = map[currentLevel];
    if (!Array.isArray(level) || cellY < 0 || cellY >= level.length)
        return true;
    const row = level[cellY];
    if (!Array.isArray(row) || cellX < 0 || cellX >= row.length) return true;
    return row[cellX] === 1;
}

// Check if a player at nextX,nextY (center) would overlap any wall tile
function canMoveTo(nextX, nextY, radius = player.radius) {
    // compute the AABB of the circle and sample overlapped tiles
    const left = nextX - radius;
    const right = nextX + radius;
    const top = nextY - radius;
    const bottom = nextY + radius;

    const startCol = Math.floor(left / Boundary.width);
    const endCol = Math.floor(right / Boundary.width);
    const startRow = Math.floor(top / Boundary.height);
    const endRow = Math.floor(bottom / Boundary.height);

    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (isWallAtCell(col, row)) return false;
        }
    }
    return true;
}

// Get tile value at world center coordinates
function getTileAtCoord(x, y) {
    const col = Math.floor(x / Boundary.width);
    const row = Math.floor(y / Boundary.height);
    const level = map[currentLevel];
    if (!Array.isArray(level) || row < 0 || row >= level.length) return -1;
    const r = level[row];
    if (!Array.isArray(r) || col < 0 || col >= r.length) return -1;
    return r[col];
}

function setTileAtCoord(x, y, value) {
    const col = Math.floor(x / Boundary.width);
    const row = Math.floor(y / Boundary.height);
    const level = map[currentLevel];
    if (!Array.isArray(level) || row < 0 || row >= level.length) return;
    const r = level[row];
    if (!Array.isArray(r) || col < 0 || col >= r.length) return;
    r[col] = value;
}

/**
 * Reset to spawn on DEATH from an enemy.
 * TODO: death feedback/animation.
 */
function resetPlayerToSpawn() {
    if (playerSpawn) {
        player.position.x = playerSpawn.x;
        player.position.y = playerSpawn.y;
    } else {
        console.log("Couldnt reset to spawn");
    }
}

function animate() {
    c.clearRect(0, 0, canv.width, canv.height);
    bound.forEach((boundary) => {
        boundary.draw();
    });
    coins.forEach((coin) => coin.update());
    enemies.forEach((enemy) => {
        enemy.draw();
        // Per-frame enemy collision safety
        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;
        const distSq = dx * dx + dy * dy;
        const minDist = player.radius + enemy.radius;
        // Kill the player
        if (distSq <= minDist * minDist) {
            resetPlayerToSpawn();
        }
    });

    // Victory check (in case moved externally)
    // if (!won && getTileAtCoord(player.position.x, player.position.y) === 5) {
    //     won = true;
    //     // simple overlay hint
    //     c.save();
    //     c.fillStyle = "rgba(0,0,0,0.35)";
    //     c.fillRect(0, 0, canv.width, canv.height);
    //     c.fillStyle = "white";
    //     c.font = "24px Hack, monospace";
    //     c.fillText("Victory! Press R to restart.", 20, 40);
    //     c.restore();
    // }
    player.update();
    requestAnimationFrame(animate);
}

animate();

// Keypress tracking for multi-inputs
addEventListener("keydown", ({ key }) => {
    if (won) {
        if (key === "r" || key === "R") {
            currentLevel++;
            renderLevel(currentLevel);
        }
        return;
    }
    // step size aligns with grid
    const stepX = Boundary.width;
    const stepY = Boundary.height;
    let nextX = player.position.x;
    let nextY = player.position.y;

    switch (key) {
        case "k": // up
        case "ArrowUp":
            nextY -= stepY;
            break;
        case "h": // left
        case "ArrowLeft":
            nextX -= stepX;
            break;
        case "j": // down
        case "ArrowDown":
            nextY += stepY;
            break;
        case "l": // right
        case "ArrowRight":
            nextX += stepX;
            break;
        default:
            return; // ignore other keys
    }

    // Only move if destination is not blocked by walls
    if (canMoveTo(nextX, nextY)) {
        player.position.x = nextX;
        player.position.y = nextY;

        // Collect coins at new position
        for (let i = 0; i < coins.length; i++) {
            const coin = coins[i];
            const dx = player.position.x - coin.position.x;
            const dy = player.position.y - coin.position.y;
            const distSq = dx * dx + dy * dy;
            const minDist = player.radius + coin.radius;
            if (distSq <= minDist * minDist) {
                score += 1;
                coins.splice(i, 1);
                i--;
                setTileAtCoord(coin.position.x, coin.position.y, 0);
            }
        }

        // Victory tile when stepped onto
        if (getTileAtCoord(player.position.x, player.position.y) === 5) {
            won = true;
        }
    }
});

// Locate player spawn from map (first tile marked 2)
function findPlayerSpawn() {
    const level = map[currentLevel];
    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            if (level[i][j] === 2) return coordTranslator(j, i, true);
        }
    }
    return null;
}
