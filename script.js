         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Glitch</title>
    <link rel="stylesheet" href="style.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        body {
            background: #0a0a0a;
            color: #00ffcc;
            font-family: 'Press Start 2P', cursive;
            text-align: center;
            margin: 0;
            overflow: hidden;
        }

        .game-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        h1 {
            font-size: 2rem;
            text-shadow: 0px 0px 8px #00ffcc;
            animation: glitch 1.5s infinite alternate;
        }

        @keyframes glitch {
            0% { text-shadow: 4px 4px 0px #ff00ff, -4px -4px 0px #00ffff; }
            100% { text-shadow: -4px -4px 0px #ff00ff, 4px 4px 0px #00ffff; }
        }

        canvas {
            background: rgba(0, 255, 204, 0.1);
            border: 4px solid #00ffcc;
            box-shadow: 0px 0px 20px #00ffcc;
        }

        .score {
            font-size: 1.5rem;
            margin-top: 10px;
        }

        button {
            background: #ff00ff;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0px 0px 10px #ff00ff;
            transition: 0.3s;
        }

        button:hover {
            background: #00ffff;
            box-shadow: 0px 0px 15px #00ffff;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>Flappy Glitch</h1>
        <canvas id="gameCanvas" width="400" height="600"></canvas>
        <p class="score">Punteggio: <span id="score">0</span></p>
        <button id="start-btn">Inizia</button>
    </div>
    <script>
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = 600;

        let bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0, gravity: 0.3, jump: -6 };
        let pipes = [];
        let score = 0;
        let gameRunning = false;
        let lastPipeX = 0; 
        let pipeGap = 150; 

        document.getElementById("start-btn").addEventListener("click", startGame);
        document.addEventListener("keydown", (event) => {
            if (event.code === "Space") {
                bird.velocity = bird.jump;
            }
        });

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
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            if (bird.y >= canvas.height - bird.height || bird.y <= 0) {
                endGame();
                return;
            }

            if (Math.random() < 0.05 && (lastPipeX === 0 || canvas.width - lastPipeX > 200)) {
                let pipeY = Math.random() * (canvas.height - pipeGap - 100) + 50;
                pipes.push({ x: canvas.width, y: pipeY });
                lastPipeX = canvas.width;
            }

            pipes.forEach(pipe => {
                pipe.x -= 3;
                ctx.fillStyle = "#ff00ff";
                ctx.fillRect(pipe.x, 0, 40, pipe.y);
                ctx.fillRect(pipe.x, pipe.y + pipeGap, 40, canvas.height - pipe.y - pipeGap);

                if (bird.x < pipe.x + 40 && bird.x + bird.width > pipe.x &&
                    (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)) {
                    endGame();
                    return;
                }

                if (pipe.x + 40 === bird.x) {
                    score++;
                    document.getElementById("score").textContent = score;
                }
            });

            pipes = pipes.filter(pipe => pipe.x > -40);
            ctx.fillStyle = "#00ffcc";
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
            requestAnimationFrame(gameLoop);
        }

        function endGame() {
            gameRunning = false;
            alert("Game Over! Punteggio: " + score);
        }
