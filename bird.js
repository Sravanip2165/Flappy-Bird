let board;
let boardWidth = 350;
let boardHeight = 540;
let context;

// Bird properties
let birdWidth = 54;
let birdHeight = 34;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight,
};

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2; // Speed of pipe movement
let velocityY = 0; // Bird's jump velocity
let gravity = 0.5;
let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "../Images/flappy.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = "../Images/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "../Images/botpipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    // Clear canvas
    context.clearRect(0, 0, board.width, board.height);

    // Bird movement
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Check if bird falls below the board
    if (bird.y > board.height) {
        gameOver = true;
    }

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Update score
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // Increment score by 1 for each passed pipe
            pipe.passed = true;
        }

        // Check for collision
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Remove off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Draw score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // Game over message
    if (gameOver) {
        context.fillText("GAME OVER!", 45, 300);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4; // Space between top and bottom pipes

    // Top pipe
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };
    pipeArray.push(topPipe);

    // Bottom pipe
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };
    pipeArray.push(bottomPipe);
}

function moveBird(event) {
    if (
        event.code === "Space" ||
        event.code === "ArrowUp" ||
        event.type === "touchstart"
    ) {
        velocityY = -6; // Adjust jump strength
    }

    // Reset game on game over
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        velocityY = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
