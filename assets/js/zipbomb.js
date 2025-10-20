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
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
const map = [
    ["-", "-", "-", "-", "-", "-"],
    ["-", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", "-"],
    ["-", "-", "-", "-", "-", "-"],
];
const bound = [];

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case "-":
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

bound.forEach((boundary) => {
    boundary.draw();
});

// class Player {
//     constructor({ x, y, color }) {
//         this.x = x;
//         this.y = y;
//         this.color = color;
//     }

//     draw() {
//         c.beginPath();
//         c.arc(this.x, this.y, 30, Math.PI * 2, false);
//         c.fillStyle = this.color;
//         c.fill();
//     }
// }

// const player = new Player(100, 100, "blue");
// player.draw();
