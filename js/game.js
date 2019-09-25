console.log("Its working!")


// DATABASE
const db = firebase.firestore();
const boldoo = db.collection('pacman').doc('boldoo');

// CANVAS VARIABLES
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bw = 300;
var bh = 300;
var p = 10;
var cw = bw + (p * 2) + 1;
var ch = bh + (p * 2) + 1;

// PACMAN VARIABLES
// var x = canvas.width - 305;
// var y = canvas.height - 305;
var x, y;
var dx = 2;
var dy = 2;
var dirX = 1;
var dirY = 0;
var future = 'N';

// ANIMATION
var animation_indx = 0;
var step = 0;
let pacman = [];

[1, 2, 3, 2, 1].forEach(function(indx) {
    let png = new Image();
    png.src = "src/pacman" + indx + ".png";
    pacman.push(png);
});


boldoo.onSnapshot(docSnapshot => {
    console.log(`Received doc snapshot: ${docSnapshot}`);
    x = docSnapshot.data().x;
    y = docSnapshot.data().y;
}, err => {
    console.log(`Encountered error: ${err}`);
});

function updateP() {
    boldoo.update({
        x: x,
        y: y
    });
}


function drawBoard() {
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
}




this.addEventListener("keydown", myEventHandler);

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

    // console.log(x, y);
}

setInterval(draw, 10);
setInterval(updateP, 100);