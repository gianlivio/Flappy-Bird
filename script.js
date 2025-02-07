const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        
        let bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0, gravity: 0.6, jump: -10 };
        let pipes = [];
        let score = 0;
        let gameRunning = false;
        
        document.getElementById("start-btn").addEventListener("click", startGame);
        document.addEventListener("keydown", () => { if (gameRunning) bird.velocity = bird.jump; });
        
        function startGame() {
            pipes = [];
            score = 0;
            bird.y = 150;
            bird.velocity = 0;
            gameRunning = true;
            gameLoop();
        }
        
        function gameLoop() {
            if (!gameRunning) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;
            
            if (bird.y >= canvas.height - bird.height || bird.y <= 0) endGame();
            
            if (Math.random() < 0.02) pipes.push({ x: canvas.width, y: Math.random() * (canvas.height - 150) });
            
            pipes.forEach(pipe => {
                pipe.x -= 3;
                ctx.fillStyle = "#ff00ff";
                ctx.fillRect(pipe.x, 0, 40, pipe.y);
                ctx.fillRect(pipe.x, pipe.y + 100, 40, canvas.height - pipe.y);
                
                if (bird.x < pipe.x + 40 && bird.x + bird.width > pipe.x &&
                    (bird.y < pipe.y || bird.y + bird.height > pipe.y + 100)) {
                    endGame();
                }
            });
            
            pipes = pipes.filter(pipe => pipe.x > -40);
            
            ctx.fillStyle = "#00ffcc";
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
            
            document.getElementById("score").textContent = score++;
            requestAnimationFrame(gameLoop);
        }
        
        function endGame() {
            gameRunning = false;
            alert("Game Over! Punteggio: " + score);
        }
