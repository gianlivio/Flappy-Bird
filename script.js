const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let lastTouchTime = 0;
const touchThreshold = 300; // ms tra i touch per evitare doppi tap

function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const baseWidth = 400;
    const baseHeight = 600;
    const baseAspectRatio = baseWidth / baseHeight;
    
    let newWidth, newHeight;
    const isMobile = window.innerWidth <= 767;
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isMobile) {
        if (!isLandscape) {
            // Portrait
            newHeight = Math.min(containerHeight * 0.8, baseHeight);
            newWidth = newHeight * baseAspectRatio;
            
            if (newWidth > containerWidth * 0.95) {
                newWidth = containerWidth * 0.95;
                newHeight = newWidth / baseAspectRatio;
            }
        } else {
            // Landscape
            newWidth = Math.min(containerWidth * 0.9, baseWidth);
            newHeight = newWidth / baseAspectRatio;
            
            if (newHeight > containerHeight * 0.9) {
                newHeight = containerHeight * 0.9;
                newWidth = newHeight * baseAspectRatio;
            }
        }
    } else {
        // Tablet e Desktop
        newHeight = Math.min(containerHeight * 0.9, baseHeight);
        newWidth = newHeight * baseAspectRatio;
        
        if (newWidth > containerWidth * (window.innerWidth > 1199 ? 0.4 : 0.6)) {
            newWidth = containerWidth * (window.innerWidth > 1199 ? 0.4 : 0.6);
            newHeight = newWidth / baseAspectRatio;
        }
    }
    
    // Gestione DPI per schermi ad alta densità
    const dpr = window.devicePixelRatio || 1;
    canvas.width = newWidth * dpr;
    canvas.height = newHeight * dpr;
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    
    // Scala il contesto per la risoluzione corretta
    ctx.scale(dpr, dpr);
    
    // Aggiorna i parametri di gioco
    adjustGameParameters(newWidth, newHeight);
}

// ... [resto del codice del gioco rimane invariato fino agli event listeners] ...

// Event Listeners migliorati
function handleTouch(e) {
    e.preventDefault();
    const currentTime = Date.now();
    
    // Previene doppi tap troppo ravvicinati
    if (currentTime - lastTouchTime < touchThreshold) {
        return;
    }
    
    lastTouchTime = currentTime;
    handleStart();
}

// Desktop events
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        handleStart();
    }
});

// Mobile events ottimizzati
canvas.addEventListener("touchstart", handleTouch, { passive: false });

// Prevenzione scrolling solo sul canvas
canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

// Gestione resize e orientamento
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
        optimizeForDevice();
    }, 250);
}

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        handleResize();
    }, 100);
});

// Inizializzazione
window.addEventListener('load', () => {
    resizeCanvas();
    optimizeForDevice();
    
    // Previene il bounce su iOS
    document.body.addEventListener('touchmove', (e) => {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Ottimizzazione per dispositivo
function optimizeForDevice() {
    const isMobile = window.innerWidth < 768;
    game.pipeGenerationInterval = isMobile ? 150 : 120;
    
    // Adatta la velocità del gioco per mobile
    if (isMobile) {
        game.speed = game.speed * 0.9; // Leggermente più lento su mobile
    }
}

// Handle visibility change to pause/resume game
document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.isRunning) {
        game.isRunning = false;
    }
});

// Prevent zoom gestures
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    optimizeForDevice();
});
