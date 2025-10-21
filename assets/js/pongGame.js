let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let context = canvas.getContext("2d");

function LeftPaddle(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.drawLeftPaddle = function () {
        context.beginPath();
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, this.w, this.h);
    };

    this.updatePaddle = function () {
        this.drawLeftPaddle();
    };
}

function RightPaddle(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.drawRightPaddle = function () {
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, this.w, this.h);
    };

    this.updatePaddle = function () {
        this.drawRightPaddle();
    };
}

function Ball(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.draw = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.strokeStyle = "white";
        context.fillStyle = "red";
        context.fill();
        context.stroke();
    };

    this.update = function () {
        if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    };
}

/*let x = Math.random() * innerWidth;
let y = Math.random() * innerHeight;
let dx = (Math.random() - 0.5) * 18;
let dy = (Math.random() - 0.5) * 18;
let radius = 30;*/

let gameBall = new Ball(200, 200, 3, 3, 30);
let lPaddle = new LeftPaddle(0, 100, 20, 200);
let rPaddle = new RightPaddle(canvas.width - 30, 100, 20, 200);

// move player paddle with w and s keys
window.addEventListener("keydown", playerPaddleMove, false);

function playerPaddleMove(e) {
    switch (e.keyCode) {
        case 38: // up arrow on keyboard
            // paddle up
            lPaddle.y -= 60;
            break;

        case 40: // down arrow on keyboard
            // paddle down
            lPaddle.y += 60;
            break;
    }
    console.log(e.keyCode);
    console.log(lPaddle.y);
}

function animate() {
    requestAnimationFrame(animate);
    context.beginPath();
    context.clearRect(0, 0, innerWidth, innerHeight);
    // Draw center line
    context.rect(canvas.width / 2 - 4, 0, 8, canvas.height);
    context.fillStyle = "white";
    context.fill();

    //draw top border line
    context.rect(0, 0, canvas.width, 8);
    context.fillStyle = "white";
    context.fill();

    //draw bottom border line
    context.rect(0, canvas.height - 8, canvas.width, 8);
    context.fillStyle = "white";
    context.fill();

    lPaddle.updatePaddle();
    rPaddle.updatePaddle();
    gameBall.update();
}
animate();

//Resize if screen size changes, so right paddle doesn't go off screen
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rPaddle.x = canvas.width - 30;
});
