import { buildLayout } from "./layout.js";

export default async function main(game) {
    const container = buildLayout();
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    const ctx = game.context || game.canvas?.getContext('2d');
    game.sn
    if (game?.stage?.aim) {
        game.stage.aim.visible = false;
    }

    worker.onmessage = ({ data }) => {
        if (data.type === 'prediction') {
            const { x, y, label } = data;
            container.updateHUD(data);
            const snake = game.snakeController;
            
            // We need the snake's current head position
            // Based on your object, centerY/centerX might be the middle of the screen
            // or the head. Let's assume we use the game center for logic:
            const headX = game.centerX;
            const headY = game.centerY;

            if (label === 'food') {
            // "Hungry" Logic
            const dist = Math.sqrt(Math.pow(x - headX, 2) + Math.pow(y - headY, 2)).toFixed(0);
            console.log(`🍎 [TARGETING] Apple detected! Distance: ${dist}px. Calculated trajectory: (${x}, ${y})`);
            // Move TOWARDS (Simple axis alignment)
            if (Math.abs(x - headX) > Math.abs(y - headY)) {
                snake.deltaX = x > headX ? 1 : -1;
                snake.deltaY = 0;
            } else {
                snake.deltaX = 0;
                snake.deltaY = y > headY ? 1 : -1;
            }
        } 
        else if (label === 'bomb') {
            // "Survival" Logic
            if (dist < 50) {
                console.warn(`💣 [EMERGENCY] Bomb too close! (${dist}px). Initiating evasive maneuvers!`);
                
                // Panic Turn: If moving horizontal, go vertical (and vice-versa)
                if (snake.deltaX !== 0) {
                    snake.deltaX = 0;
                    snake.deltaY = y > headY ? -1 : 1; // Turn away from bomb Y
                } else {
                    snake.deltaY = 0;
                    snake.deltaX = x > headX ? -1 : 1; // Turn away from bomb X
                }
            } else {
                console.log(`🕶️ [SCANNING] Bomb identified at ${dist}px. Path is currently clear.`);
            }
        }
        }
    }



    setInterval(async () => {
        if (!game?.canvas) return;
        const bitmap = await createImageBitmap(game.canvas);
        worker.postMessage({
            type: 'predict',
            width: game.canvas.width,
            height: game.canvas.height,
            image: bitmap,
        }, [bitmap]);
    }, 300);

    return container;
}

function moveToTarget(game, targetX, targetY) {
    const snake = game.snakeController;
    const headX = game.centerX; // You'll need the snake's actual head position
    const headY = game.centerY;

    // Simple Logic: If target is to the right, move right
    if (targetX > headX) snake.deltaX = 1, snake.deltaY = 0;
    else if (targetX < headX) snake.deltaX = -1, snake.deltaY = 0;
    else if (targetY > headY) snake.deltaX = 0, snake.deltaY = 1;
    else if (targetY < headY) snake.deltaX = 0, snake.deltaY = -1;
}

function avoidTarget(game, bombX, bombY) {
    const snake = game.snakeController;
    // If the bomb is close on the X axis, switch to Y axis to dodge
    if (Math.abs(bombX - game.centerX) < 20) {
        snake.deltaX = 0;
        snake.deltaY = (bombY > game.centerY) ? -1 : 1; // Move opposite of bomb Y
    }
}