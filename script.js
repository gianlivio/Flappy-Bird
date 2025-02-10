const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Impostazioni del gioco
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

// Funzione per ridimensionare il canvas in base allo schermo
function resizeCanvas() {
    let aspectRatio = 2/3; // Mantiene proporzione 400x600
    let width = window.innerWidth * 0.9; // Adatta alla larghezza dello schermo
    let height = width * aspectRatio;

    if (height > window.innerHeight * 0.9) {
        height = window.innerHeight * 0.9;
        width = height / aspectRatio;
    }

    canvas.width = width;
    canvas.height = height;
}

// Funzione per resettare il gioco
function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    game.pipes = [];
    game.score = 0;
    game.frameCount = 0;
    game.isRunning = false;
    document.getElementById("score").textContent = game.score;
}

// Avvia il gioco
function startGame() {
    if (!game.isRunning) {
        game.isRunning = true;
        resetGame();
        gameLoop();
    }
}

// Salto del personaggio
function jump() {
    bird.velocity = bird.jumpStrength;
}

// Crea un nuovo tubo
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

// Disegna il personaggio
function drawBird() {
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Disegna i tubi
function drawPipes(pipe) {
    ctx.fillStyle = "#ff00ff";
    ctx.fillRect(pipe.x, 0, game.pipeWidth, pipe.topHeight);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, game.pipeWidth, pipe.bottomHeight);
}

// Controlla le collisioni
function checkCollision(pipe) {
    const birdRight = bird.x + bird.width;
    const birdBottom = bird.y + bird.height;
    const pipeRight = pipe.x + game.pipeWidth;

    const hitTopPipe = birdRight > pipe.x && bird.x < pipeRight && bird.y < pipe.topHeight;
    const hitBottomPipe = birdRight > pipe.x && bird.x < pipeRight && birdBottom > canvas.height - pipe.bottomHeight;

    return hitTopPipe || hitBottomPipe || bird.y + bird.height > canvas.height || bird.y < 0;
}

// Loop principale del gioco
function gameLoop() {
    if (!game.isRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fisica del personaggio
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Generazione dei tubi
    game.frameCount++;
    if (game.pipes.length === 0 || game.frameCount % 120 === 0) {
        game.pipes.push(createPipe());
    }

    // Disegna e aggiorna i tubi
    for (let i = game.pipes.length - 1; i >= 0; i--) {
        const pipe = game.pipes[i];
        pipe.x -= game.speed;
        drawPipes(pipe);

        // Controlla collisioni
        if (checkCollision(pipe)) {
            endGame();
            return;
        }

        // Aggiorna il punteggio
        if (!pipe.passed && pipe.x + game.pipeWidth < bird.x) {
            game.score++;
            pipe.passed = true;
            document.getElementById("score").textContent = game.score;
        }

        // Rimuove i tubi fuori dallo schermo
        if (pipe.x + game.pipeWidth < 0) {
            game.pipes.splice(i, 1);
        }
    }

    // Disegna il personaggio
    drawBird();

    requestAnimationFrame(gameLoop);
}

// Termina il gioco
function endGame() {
    game.isRunning = false;
    alert(`Game Over! Punteggio: ${game.score}`);
}

// Eventi
document.getElementById("start-btn").addEventListener("click", startGame);
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (!game.isRunning) startGame();
        jump();
    }
});

// Controlli touch per mobile
canvas.addEventListener("click", jump);
canvas.addEventListener("touchstart", jump);

// Evita il refresh accidentale con swipe verso il basso
document.addEventListener("touchmove", function(event) {
    event.preventDefault();
}, { passive: false });

// Adatta il canvas alla dimensione dello schermo
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

