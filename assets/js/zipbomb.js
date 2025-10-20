const canv = document.querySelector("canvas");
const c = canv.getContext("2d");

canv.width = window.innerWidth;
canv.height = window.innerHeight;

class Boundary {
    static width = 40;
    static height = 40;
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

// Implementation variables
const bound = [];
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

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// translate map array and create map boundaries
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case 1:
                bound.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i,
                        },
                    })
                );
                break;
        }
    });
});

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canv.width, canv.height);
    bound.forEach((boundary) => {
        boundary.draw();

        player.update();
        // collision detection

        if (
            player.position.y - player.radius <=
                boundary.position.y + boundary.height &&
            player.position.x + player.radius >= boundary.position.x &&
            player.position.y + player.radius >= boundary.position.y &&
            player.position.x - player.radius <=
                boundary.position.x + boundary.width
        ) {
            console.log("collide");
        }
    });
}

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
