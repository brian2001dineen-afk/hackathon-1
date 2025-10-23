let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let context = canvas.getContext("2d");
let playerScore = 0;
let computerScore = 0;
const MAX_SCORE = 3;
let buttonX = 300;
let buttonY = 20;
let buttonWidth = 200;
let buttonHeight = 60;
let buttonColor = "red";
let buttonText = "Start Game";
let fontSize = 20;

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

    this.checkBounds = function () {
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.h > canvas.height) {
            this.y = canvas.height - this.h;
        }
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
        context.beginPath();
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, this.w, this.h);
    };

    this.checkAIBounds = function () {
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.h > canvas.height) {
            this.y = canvas.height - this.h;
        }
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
        /*if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }*/

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

let gameBall = new Ball(200, 200, 3, 3, 10);
let lPaddle = new LeftPaddle(0, 100, 20, 150);
let rPaddle = new RightPaddle(canvas.width - 30, 100, 20, 150);

// move player paddle with up and down arrow keys
window.addEventListener("keydown", playerPaddleMove, false);

function playerPaddleMove(e) {
    switch (e.keyCode) {
        case 38: // up arrow on keyboard
            // paddle up
            lPaddle.y -= 60;
            //makes sure paddle doesnt go off screen
            lPaddle.checkBounds();
            break;

        case 40: // down arrow on keyboard
            // paddle down
            lPaddle.y += 60;
            lPaddle.checkBounds();
            break;
    }
}

window.addEventListener("click", resetBallAfterScore, false);

function resetBallAfterScore() {
    console.log("Canvas clicked!");
}

// collision detection between ball and paddles
function collisionDetection(paddle) {
    let nearestPointX;
    let nearestPointY;
    if (gameBall.x < paddle.x) {
        nearestPointX = paddle.x;
    } else if (gameBall.x > paddle.x + paddle.w) {
        nearestPointX = paddle.x + paddle.w;
    } else {
        nearestPointX = gameBall.x;
    }

    if (gameBall.y < paddle.y) {
        nearestPointY = paddle.y;
    } else if (gameBall.y > paddle.y + paddle.h) {
        nearestPointY = paddle.y + paddle.h;
    } else {
        nearestPointY = gameBall.y;
    }

    let distX = gameBall.x - nearestPointX;
    let distY = gameBall.y - nearestPointY;
    let distance = Math.sqrt(distX * distX + distY * distY);
    return distance <= gameBall.radius;
}

function checkIfBallHasGonePastPaddles() {
    if (gameBall.x - gameBall.radius < 0) {
        computerScore++;
        let compCenterX = canvas.width / 2;
        let compCenterY = canvas.height / 2;
        gameBall.x = compCenterX;
        gameBall.y = compCenterY;
    } else if (gameBall.x + gameBall.radius > canvas.width) {
        playerScore++;
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        gameBall.x = centerX;
        gameBall.y = centerY;
    }
}

function computerPaddleMovement() {
    // Find the center of the paddle
    let paddleCenter = rPaddle.y + rPaddle.h / 2;

    // Difference between ball Y and paddle center
    let deltaY = gameBall.y - paddleCenter;

    // Limit how fast the paddle can move (slower than ball speed)
    let maxSpeed = 2; // adjust this to make AI easier/harder

    // Move paddle toward ball by at most maxSpeed
    if (deltaY > maxSpeed) {
        rPaddle.y += maxSpeed;
    } else if (deltaY < -maxSpeed) {
        rPaddle.y -= maxSpeed;
    } else {
        rPaddle.y += deltaY; // small remaining distance
    }

    // Occasionally add “human error” so AI can miss
    if (Math.random() < 0.3) {
        // 30% chance
        rPaddle.y += Math.random() * 10 - 5; // random offset -5 to +5
    }

    // Keep the paddle inside the canvas
    rPaddle.checkAIBounds();
}

function updateScores() {}

function checkWhoWon() {}

function resetGame() {}

function animate() {
    requestAnimationFrame(animate);
    context.beginPath();
    context.clearRect(0, 0, innerWidth, innerHeight);

    //Draw start button
    context.fillStyle = buttonColor;
    context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    context.font = fontSize + "px Arial";
    context.fillStyle = "white";
    let textWidth = context.measureText(buttonText).width;
    let textX = buttonX + (buttonWidth - textWidth) / 2;
    let textY = buttonY + (buttonHeight + fontSize) / 2;
    context.fillText(buttonText, textX, textY);

    context.font = "30px Arial";
    context.fillStyle = "white";
    context.fillText("Player Score:", 520, 50);

    context.fillStyle = "white";
    context.fillText(playerScore, 705, 50);

    context.fillStyle = "white";
    context.fillText("Computer Score:", 800, 50);

    context.fillStyle = "white";
    context.fillText(computerScore, 1030, 50);

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
    computerPaddleMovement();
    checkIfBallHasGonePastPaddles();

    if (collisionDetection(lPaddle)) {
        gameBall.x = lPaddle.x + lPaddle.w + gameBall.radius; // move ball outside paddle
        gameBall.dx = -gameBall.dx; // reverse direction
        console.log("Collision with left paddle!");
    }

    // Collision with right paddle
    if (collisionDetection(rPaddle)) {
        gameBall.x = rPaddle.x - gameBall.radius; // move ball outside paddle
        gameBall.dx = -gameBall.dx; // reverse direction
        console.log("Collision with right paddle!");
    }
}
animate();

//Resize if screen size changes, so right paddle doesn't go off screen
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rPaddle.x = canvas.width - 30;
});

/*function computerPaddleMovement() {
    // Find the center of the paddle
    let paddleCenter = rPaddle.y + rPaddle.h / 2;

    // Difference between ball Y and paddle center
    let deltaY = gameBall.y - paddleCenter;

    // Limit how fast the paddle can move (slower than ball speed)
    let maxSpeed = 2; // lower this to make AI miss sometimes

    // Move paddle toward ball by at most maxSpeed
    if (deltaY > 0) {
        rPaddle.y += Math.min(deltaY, maxSpeed);
    } else if (deltaY < 0) {
        rPaddle.y += Math.max(deltaY, -maxSpeed);
    }

    // Add a bigger random offset occasionally to make AI miss
    if (Math.random() < 0.3) {
        // 30% chance
        rPaddle.y += Math.random() * 20 - 10; // random shift -10 to +10
    }

    // Keep the paddle inside the canvas
    rPaddle.checkAIBounds();
}*/

// simple AI for computer paddle
/*function computerPaddleMovement() {
    if (gameBall.y < rPaddle.y) {
        rPaddle.y -= 4;
        let compRand = Math.floor(Math.random() * 7) - 3;
        rPaddle.y -= compRand;
        rPaddle.checkAIBounds();
    }

    if (gameBall.y > rPaddle.y + rPaddle.h) {
        rPaddle.y += 4;
        let compRand2 = Math.floor(Math.random() * 7) - 3;
        rPaddle.y += compRand2;
        rPaddle.checkAIBounds();
    }
}*/
