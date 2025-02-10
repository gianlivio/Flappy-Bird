
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
    jumpStrength: -9
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
    game.isRunning = false;
    document.getElementById("score").textContent = game.score;
}

function jump() {
    bird.velocity = bird.jumpStrength;
}

function startGame() {
    if (!game.isRunning) {
        game.isRunning = true;
        gameLoop();
    }
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
    ctx.fillRect(pipe.x, 0, game.pipeWidth, pipe.topHeight);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, game.pipeWidth, pipe.bottomHeight);
}

function checkCollision(pipe) {
    const birdRight = bird.x + bird.width;
    const birdBottom = bird.y + bird.height;
    const pipeRight = pipe.x + game.pipeWidth;

    const hitTopPipe = birdRight > pipe.x && 
                       bird.x < pipeRight && 
                       bird.y < pipe.topHeight;

    const hitBottomPipe = birdRight > pipe.x && 
                          bird.x < pipeRight && 
                          birdBottom > canvas.height - pipe.bottomHeight;

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
    if (game.pipes.length === 0 || game.frameCount % 120 === 0) {
        game.pipes.push(createPipe());
    }

    // Update and draw pipes
    for (let i = game.pipes.length - 1; i >= 0; i--) {
        const pipe = game.pipes[i];
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

        // Remove offscreen pipes
        if (pipe.x + game.pipeWidth < 0) {
            game.pipes.splice(i, 1);
        }
    }

    // Draw bird
    drawBird();

    requestAnimationFrame(gameLoop);
}

function endGame() {
    game.isRunning = false;
    alert(Game Over! Punteggio: ${game.score});
}

// Event Listeners
document.getElementById("start-btn").addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (!game.isRunning) {
            startGame();
        }
        jump();
    }
});

canvas.addEventListener("click", () => {
    if (!game.isRunning) {
        startGame();
    }
    jump();
});



