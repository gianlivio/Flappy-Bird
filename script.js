const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

const bird = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -8
};

const game = {
    pipes: [],
    score: 0,
    isRunning: false,
    speed: 2,
    pipeGap: 200,
    pipeWidth: 50,
    frameCount: 0
};

function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    game.pipes = [];
    game.score = 0;
    game.frameCount = 0;
    document.getElementById("score").textContent = game.score;
}

function jump() {
    if (!game.isRunning) {
        game.isRunning = true;
        gameLoop();
        return;
    }
    bird.velocity = bird.jumpStrength;
}

function createPipe() {
    const minHeight = 100;
    const maxHeight = canvas.height - game.pipeGap - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    return {
        x: canvas.width,
        topHeight: topHeight,
        bottomHeight: canvas.height - topHeight - game.pipeGap,
        passed: false
    };
}

function drawBird() {
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes(pipe) {
    ctx.fillStyle = "#ff00ff";
    // Top pipe
    ctx.fillRect(pipe.x, 0, game.pipeWidth, pipe.topHeight);
    // Bottom pipe
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, game.pipeWidth, pipe.bottomHeight);
}

function checkCollision(pipe) {
    const birdRight = bird.x + bird.width;
    const birdBottom = bird.y + bird.height;
    const pipeRight = pipe.x + game.pipeWidth;

    const hitTopPipe = bird.x < pipeRight && 
                       birdRight > pipe.x && 
                       bird.y < pipe.topHeight;

    const hitBottomPipe = bird.x < pipeRight && 
                          birdBottom > canvas.height - pipe.bottomHeight &&
                          birdRight > pipe.x;

    return hitTopPipe || hitBottomPipe || bird.y + bird.height > canvas.height || bird.y < 0;
}

function gameLoop() {
    if (!game.isRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Pipe generation
    game.frameCount++;
    if (game.frameCount % 120 === 0) {
        game.pipes.push(createPipe());
    }

    // Update and draw pipes
    game.pipes.forEach((pipe, index) => {
        pipe.x -= game.speed;
        drawPipes(pipe);

        // Collision detection
        if (checkCollision(pipe)) {
            endGame();
            return;
        }

        // Score tracking
        if (!pipe.passed && pipe.x + game.pipeWidth < bird.x) {
            game.score++;
            pipe.passed = true;
            document.getElementById("score").textContent = game.score;
        }
    });

    // Remove offscreen pipes
    game.pipes = game.pipes.filter(pipe => pipe.x + game.pipeWidth > 0);

    // Draw bird
    drawBird();

    requestAnimationFrame(gameLoop);
}

function endGame() {
    game.isRunning = false;
    alert(`Game Over! Punteggio: ${game.score}`);
}

// Event Listeners
document.getElementById("start-btn").addEventListener("click", () => {
    if (!game.isRunning) {
        resetGame();
        jump();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});

canvas.addEventListener("click", jump);
