const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let bird = { 
    x: 50, 
    y: 150, 
    width: 20, 
    height: 20, 
    velocity: 0, 
    gravity: 0.3, 
    jump: -6 
};

let pipes = [];
let score = 0;
let gameRunning = false;
let lastPipeX = 0; 
let pipeGap = 150; 

document.getElementById("start-btn").addEventListener("click", startGame);
document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && gameRunning) {
        bird.velocity = bird.jump;
    }
});

function checkCollision(bird, pipe) {
    return (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)
    );
}

function updateScore(bird, pipe) {
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
        score++;
        pipe.passed = true;
        document.getElementById("score").textContent = score;
    }
}

function startGame() {
    pipes = [];
    score = 0;
    bird.y = 150;
    bird.velocity = 0;
    lastPipeX = 0;
    document.getElementById("score").textContent = score;
    gameRunning = true;
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Check for ground or ceiling collision
    if (bird.y >= canvas.height - bird.height || bird.y <= 0) {
        endGame();
        return;
    }
    
    // Generate pipes
    if (pipes.length === 0 || (Math.random() < 0.05 && canvas.width - lastPipeX > 200)) {
        const minHeight = 50;
        const maxHeight = canvas.height - pipeGap - minHeight;
        let pipeY = Math.random() * (maxHeight - minHeight) + minHeight;
        pipes.push({ 
            x: canvas.width, 
            y: pipeY, 
            width: 40,
            passed: false 
        });
        lastPipeX = canvas.width;
    }
    
    // Update and draw pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= 3;
        
        // Draw pipes
        ctx.fillStyle = "#ff00ff";
        ctx.fillRect(pipe.x, 0, 40, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, 40, canvas.height - pipe.y - pipeGap);
        
        // Check collision
        if (checkCollision(bird, pipe)) {
            endGame();
            return;
        }
        
        // Update score
        updateScore(bird, pipe);
    });
    
    // Remove offscreen pipes
    pipes = pipes.filter(pipe => pipe.x > -40);
    
    // Draw bird
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    alert("Game Over! Punteggio: " + score);
}
