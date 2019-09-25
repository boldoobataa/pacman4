console.log("Its working!")
var bw = 300;
var bh = 300;
var p = 10;
var cw = bw + (p * 2) + 1;
var ch = bh + (p * 2) + 1;
var animation_indx = 0;
var step = 0;

let pacman = [];

[1, 2, 3, 2, 1].forEach(function(indx) {
    let png = new Image();
    png.src = "images/pacman" + indx + ".png";
    pacman.push(png);
});

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function drawBoard() {
    // if (x / 15 % 2 == ) {
    for (var x = 0; x <= bw; x += 15) {
        ctx.beginPath();
        ctx.moveTo(0.5 + x + p, p);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.lineTo(0.5 + x + p, bh + p);
        ctx.stroke();
    }

    for (var x = 0; x <= bh; x += 15) {
        ctx.beginPath();
        ctx.moveTo(p, 0.5 + x + p);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.lineTo(bw + p, 0.5 + x + p);
        ctx.stroke();
    }

    for (var x = 15; x <= bw; x += 30) {
        ctx.beginPath();
        ctx.moveTo(0.5 + x + p, p + 15);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.lineTo(0.5 + x + p, bh + p - 14);
        ctx.stroke();
    }

    for (var x = 15; x <= bh; x += 30) {
        ctx.beginPath();
        ctx.moveTo(p + 15, 0.5 + x + p);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.lineTo(bw + p - 14, 0.5 + x + p);
        ctx.stroke();
    }
    // }
}

var x = canvas.width - 305;
var y = canvas.height - 305;
var dx = 2;
var dy = 2;
var dirX = 1;
var dirY = 0;
var future = 'N';


this.addEventListener("keydown", myEventHandler);

const refX = firebase.database().ref('x');
const refY = firebase.database().ref('y');

// refX.on('value', function(snapshot) {
//     x = snapshot.val();
// })

// refX.on('value', function(snapshot) {
//     y = snapshot.val();
// })

function myEventHandler(event) {
    console.log(event.keyCode);
    var key = event.keyCode;
    if (key == 37 || event.key == 'a') {
        // dirX = -1;
        // dirY = 0;
        future = 'L';
    }
    if (key == 38 || event.key == 'w') {
        // dirX = 0;
        // dirY = -1;
        future = 'U';
    }
    if (key == 39 || event.key == 'd') {
        // dirX = 1;
        // dirY = 0;
        future = 'R';
    }
    if (key == 40 || event.key == 's') {
        // dirX = 0;
        // dirY = 1;
        future = 'D';
    }
}

function drawBall() {
    ctx.drawImage(pacman[animation_indx], x, y, 21, 21);
    step += 1;
    if (step == 5) {
        animation_indx++;
        if (animation_indx == 5) {
            animation_indx = 0;
            var angle = 0;
        }
        step = 0;
    }

}

function switchDir() {
    if (x % 15 == 0 && y % 15 == 0) {
        switch (future) {
            case 'U':
                dirX = 0, dirY = -1, future = 'N';
                break;
            case 'D':
                dirX = 0, dirY = 1, future = 'N';
                break;
            case 'L':
                dirX = -1, dirY = 0, future = 'N';
                break;
            case 'R':
                dirX = 1, dirY = 0, future = 'N';
                break;
            default:
                break;
        }
    }
}


function checkCollision() {
    if (future != 'N') {
        switchDir();
    }



    if (x + dirX * dx >= 15 && x + dirX * dx <= canvas.width - 34) {
        x = x + dirX * dx;
    }
    if (y + dirY * dy >= 15 && y + dirY * dy <= canvas.height - 34) {
        y = y + dirY * dy;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawBall();
    checkCollision();

    console.log(x, y);
}

setInterval(draw, 10);
class Pacman {
    constructor(offsetX, offsetY, scale) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.r = scale / 2;
        this.x = (scale * 14) + offsetX + this.r;
        this.y = (scale * 16) + offsetY + this.r;
        this.scale = scale;
        this.speed = [0, 0];
        this.jawWidth = 45;
        this.opening = false;
        this.increment = 4.5;
        this.intention = null;
        this.direction = null;
    }
    draw() {
        fill('#FFFF00');
        noStroke();
        if (this.jawWidth === 0) {
            ellipse(this.x, this.y, this.r * 2, this.r * 2);
        } else {
            push();
            translate(this.x, this.y);
            if (this.direction === "UP") {
                rotate(270);
            }
            if (this.direction === "DOWN") {
                rotate(90);
            }
            if (this.direction === "LEFT") {
                rotate(180);
            }
            arc(0, 0, this.r * 2, this.r * 2, this.jawWidth, -Math.abs(this.jawWidth), PIE);
            pop();
        }
        //this.update();
    }
    update() {
        if (!(this.x % this.scale) && !(this.y % this.scale) && this.intention) {
            if (field.ask(this.x, this.y).allowed.includes(this.intention)) {
                switch (this.intention) {
                    case "UP":
                        this.speed = [0, -1];
                        break;
                    case "DOWN":
                        this.speed = [0, 1];
                        break;
                    case "RIGHT":
                        this.speed = [1, 0];
                        break;
                    case "LEFT":
                        this.speed = [-1, 0];
                        break;
                }
                this.direction = this.intention;
                this.intention = null;
            }
        }
        if (!(this.x % this.scale) && !(this.y % this.scale)) {
            const portals = field.portal();
            const portalIndex = portals.findIndex((el) => el[0] === this.x && el[1] === this.y)
            if (!!~portalIndex) {
                const exitPortal = portals[Number(!portalIndex)];
                this.x = exitPortal[0];
                this.y = exitPortal[1];
            }
        }
        if (!(this.x % 10) && !(this.y % 10) && !(field.ask(this.x, this.y).allowed.includes(this.direction))) {
            this.direction = null;
            this.speed = [0, 0];
        }
        if (this.jawWidth === 0) {
            this.opening = false;
        }
        if (this.jawWidth === 45) {
            this.opening = true;
        }
        if (this.opening) {
            this.jawWidth -= this.increment;
        } else {
            this.jawWidth += this.increment;
        }
        this.x = this.x + this.speed[0];
        this.y = this.y + this.speed[1];

    }
    dir(DIR) {
        const portals = field.portal();
        const xBoundary = [this.x - this.scale, this.x + this.scale];
        const yBoundary = [this.y - this.scale, this.y + this.scale];
        const portalIndex = portals.findIndex((el) =>
            el[0] > xBoundary[0] &&
            el[0] < xBoundary[1] &&
            el[1] > yBoundary[0] &&
            el[1] < yBoundary[1]
        );
        console.log(!~portalIndex);
        if (!~portalIndex) {
            this.intention = DIR;
        }
    }
}