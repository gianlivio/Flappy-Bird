        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 400;
        canvas.height = 600;


        let bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0, gravity: 0.3, jump: -6 };
        let pipes = [];
        let score = 0;
        let gameRunning = false;
        let lastPipeX = 0; 

        document.getElementById("start-btn").addEventListener("click", startGame);
        document.addEventListener("keydown", (event) => {
            if (!gameRunning) startGame();
            bird.velocity = bird.jump;
        });

        function startGame() {
            pipes = [];
            score = 0;
            bird.y = 150;
            bird.velocity = 0;
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
        
            // GENERAZIONE TUBI: assicura che ci sia una distanza minima di 150px tra i tubi
            if (Math.random() < 0.05 && (lastPipeX === 0 || canvas.width - lastPipeX > 150)) {
                let pipeY = Math.random() * (canvas.height - 200) + 50; // Evita tubi troppo bassi o alti
                pipes.push({ x: canvas.width, y: pipeY });
                lastPipeX = canvas.width; // Salva la posizione del tubo appena creato
            }
        
            pipes.forEach(pipe => {
                pipe.x -= 4;
                ctx.fillStyle = "#ff00ff";
                ctx.fillRect(pipe.x, 0, 40, pipe.y);
                ctx.fillRect(pipe.x, pipe.y + 100, 40, canvas.height - pipe.y);
        
                if (bird.x < pipe.x + 40 && bird.x + bird.width > pipe.x &&
                    (bird.y < pipe.y || bird.y + bird.height > pipe.y + 100)) {
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
