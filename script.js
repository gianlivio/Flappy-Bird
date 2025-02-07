const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let bird = { 
    x: 50, 
    y: 300, 
    width: 20, 
    height: 20, 
    velocity: 0, 
    gravity: 0.5, 
    jump: -8 
};

let pipes = [];
let score = 0;
let gameRunning = false;
let gameSpeed = 2;
let pipeGap = 200;
let pipeWidth = 50;

function jump() {
    if (gameRunning) {
        bird.velocity = bird.jump;
    }
}

document.getElementById("start-btn").addEventListener("click", startGame);
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        jump();
    }
});
canvas.addEventListener("click", jump);

function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - pipeGap - minHeight;
    const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    return {
        x: canvas.width,
        topHeight: pipeHeight,
        bottomHeight: canvas.height - pipeHeight - pipeGap,
        passed: false
    };
}

function startGame() {
    pipes = [];
    score = 0;
    bird.y = 300;
    bird.velocity = 0;
    document.getElementById("score").textContent = score;
    gameRunning = true;
    gameLoop();
}

function checkCollision(bird, pipe) {
    return (
        bird.x < pipe.x + pipeWidth &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
    );
}

function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Ground and ceiling collision
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
        return;
    }
    
    // Pipe generation
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
        pipes.push(createPipe());
    }
    
    // Update and draw pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= gameSpeed;
        
        // Draw pipes
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
        
        // Collision detection
        if (checkCollision(bird, pipe)) {
            endGame();
            return;
        }
        
        // Score tracking
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
            document.getElementById("score").textContent = score;
        }
    });
    
    // Remove offscreen pipes
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
    
    // Draw bird
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    alert("Game Over! Punteggio: " + score);
}
