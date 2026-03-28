import { buildLayout } from "./layout.js";

export default async function main(game) {
    const container = buildLayout();
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    const ctx = game.context || game.canvas?.getContext('2d');
    
    worker.onmessage = ({ data }) => {
        if (data.type === 'prediction') {
            const bc = game.boardController;
            if (!bc.cellWidth) return;
            const boardX = Math.max(0, Math.min(19, Math.floor((data.x - bc.offsetX) / bc.cellWidth))) + 1;
            const boardY = Math.max(0, Math.min(19, Math.floor((data.y - bc.offsetY) / bc.cellheight))) + 1;
            console.log(`Prediction: ${data.label} at board (${boardX}, ${boardY})`);
        }

    };



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