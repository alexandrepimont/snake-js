import { buildLayout } from "./layout.js";

function getSnakeBody(snakeController) {
    const coordSnakeHead = snakeController.snake.snakeCoords[0];
    const bodyParts = [];
    // Start at index 1 to skip the head (index 0)
    for (let i = 1; i < snakeController.snake.snakeCoords.length; i++) {
        const coordSnakeBody = snakeController.snake.snakeCoords[i];
        // Push the coordinate into our tracking array
        bodyParts.push(coordSnakeBody);
    }
    return { 
        head: coordSnakeHead, 
        body: bodyParts 
    };
}


function moves(snakeController) {
    return {'up': {degree: 0, deltaX: 0, deltaY: -1}, 
            'right': {degree: 90, deltaX: 1, deltaY: 0},
            'down': {degree: 180, deltaX: 0, deltaY: 1}, 
            'left': {degree: 270, deltaX: -1, deltaY: 0} 
    }
}   


export default async function main(game) {
    const container = buildLayout();
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    const ctx = game.context || game.canvas?.getContext('2d');

    let lastFoodPos = { x: -1, y: -1 };
    let lastBombPos = { x: -1, y: -1 };    

    worker.onmessage = ({ data }) => {
        if (data.type === 'prediction') {
            const bc = game.boardController;
            if (!bc.cellWidth) return;
            const boardX = Math.max(0, Math.min(19, Math.floor((data.x - bc.offsetX) / bc.cellWidth)));
            const boardY = Math.max(0, Math.min(19, Math.floor((data.y - bc.offsetY) / bc.cellheight)));
            if (data.label === 'bomb') lastBombPos = { x: boardX, y: boardY };
            if (data.label === 'food') lastFoodPos = { x: boardX, y: boardY };
            console.log(`predicted bomb at board coordinates:`, lastBombPos.x, lastBombPos.y);
            console.log(`predicted food at board coordinates:`, lastFoodPos.x, lastFoodPos.y);
            const snakeBody = getSnakeBody(game.snakeController);
            const moves = [
                { dir: 'Up',    x: snakeBody.head.x,     y: snakeBody.head.y - 1, dx: 0,  dy: -1, deg: 0 },
                { dir: 'Down',  x: snakeBody.head.x,     y: snakeBody.head.y + 1, dx: 0,  dy: 1,  deg: 180 },
                { dir: 'Left',  x: snakeBody.head.x - 1, y: snakeBody.head.y,     dx: -1, dy: 0,  deg: 270 },
                { dir: 'Right', x: snakeBody.head.x + 1, y: snakeBody.head.y,     dx: 1,  dy: 0,  deg: 90 }
            ];
            console.log('snake:', game.snakeController);
            console.log('head:', snakeBody.head);
            console.log('body:', snakeBody.body);
            // console.log('Current snake head position:', snakeBody.head.x, snakeBody.head.y);
            // console.log('Current snake body position:', snakeBody.body[0].x, snakeBody.body[0].y);
            // if (snakeBody.body.length > 1) {
            //     for (let i = 1; i < snakeBody.body.length; i++) {
            //         console.log(`Current snake body position ${i}:`, snakeBody.body[i].x, snakeBody.body[i].y);
            //     }
            // }

            const safeMoves = moves.filter(move => {
                // Rule A: Walls (0-19)
                if (move.x < 0 || move.x > 19 || move.y < 0 || move.y > 19) return false;

                // Rule B: Body
                const hitsBody = snakeBody.body.some(seg => seg.x === move.x && seg.y === move.y);
                
                if (hitsBody) return false;

                // Rule C: Bomb (Don't step on the last known bomb position)
                if (move.x === lastBombPos.x && move.y === lastBombPos.y) return false;

                return true;
            });
            console.log('Safe moves available:', safeMoves);
            if (safeMoves.length === 0) return; // No safe moves!

            // Simple heuristic: Move towards the food if it's safe, otherwise pick a random safe move
            const moveTowardsFood = safeMoves.find(move => {
                const currentDistance = Math.abs(snakeBody.head.x - lastFoodPos.x) + Math.abs(snakeBody.head.y - lastFoodPos.y);
                const newDistance = Math.abs(move.x - lastFoodPos.x) + Math.abs(move.y - lastFoodPos.y);
                return newDistance < currentDistance;
            });
            const chosenMove = moveTowardsFood || safeMoves[Math.floor(Math.random() * safeMoves.length)];
            console.log('Chosen move:', chosenMove.dir);
            game.snakeController.degree = chosenMove.deg;
            game.snakeController.deltaX = chosenMove.dx;
            game.snakeController.deltaY = chosenMove.dy;

            // if (safeMoves.length === 0) return; // No safe moves!

        };
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