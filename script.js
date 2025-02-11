const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1200;
    
    let targetAspect = 400 / 600;
    
    // Adatta l'aspect ratio in base al dispositivo
    if (isMobile && window.innerHeight > window.innerWidth) {
        targetAspect = 350 / 525;
    } else if (isTablet) {
        targetAspect = 450 / 675;
    }
    
    let newWidth, newHeight;
    
    if (containerWidth / containerHeight > targetAspect) {
        newHeight = Math.min(containerHeight * 0.8, 600);
        newWidth = newHeight * targetAspect;
    } else {
        newWidth = Math.min(containerWidth * 0.9, 400);
        newHeight = newWidth / targetAspect;
    }
    
    // Gestione schermi ad alta densità
    const dpr = window.devicePixelRatio || 1;
    canvas.width = newWidth * dpr;
    canvas.height = newHeight * dpr;
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    
    // Scala il contesto per schermi ad alta densità
    ctx.scale(dpr, dpr);
    
    // Aggiorna i parametri di gioco
    adjustGameParameters(newWidth, newHeight);
}

function adjustGameParameters(width, height) {
    const scale = width / 400;
    
    bird.width = Math.floor(30 * scale);
    bird.height = Math.floor(30 * scale);
    bird.gravity = 0.5 * scale;
    bird.jumpStrength = -9 * scale;
    bird.x = Math.floor(50 * scale);
    
    game.speed = 2 * scale;
    game.pipeGap = Math.floor(200 * scale);
    game.pipeWidth = Math.floor(50 * scale);
}

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
    gameOver: false,
    speed: 2,
    pipeGap: 200,
    pipeWidth: 50,
    frameCount: 0,
    pipeGenerationInterval: 120
};

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    game.pipes = [];
    game.score = 0;
    game.frameCount = 0;
    game.isRunning = false;
    game.gameOver = false;
    document.getElementById("score").textContent = game.score;
}

function jump() {
    if (game.gameOver) return;
    
    if (!game.isRunning) {
        game.isRunning = true;
        gameLoop();
    }
    bird.velocity = bird.jumpStrength;
}

function createPipe() {
    const minHeight = canvas.height * 0.2;
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
    if (game.pipes.length === 0 || game.frameCount % game.pipeGenerationInterval === 0) {
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
    game.gameOver = true;
    alert(`Game Over! Punteggio: ${game.score}`);
}

// Event Listeners for multiple input methods
function handleStart() {
    if (game.gameOver) {
        resetGame();
    }
    
    if (!game.isRunning) {
        startGame();
    }
    jump();
}

function startGame() {
    game.isRunning = true;
    gameLoop();
}

// Desktop events
document.getElementById("start-btn").addEventListener("click", handleStart);
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        handleStart();
    }
});

// Mobile events
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent scrolling
    handleStart();
});

// Prevent default touch behaviors
document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
document.body.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });

// Resize handling
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial resize

// Disable zoom
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());
