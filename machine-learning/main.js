import { buildLayout } from "./layout.js";

export default async function main(game) {
    const container = buildLayout();
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

    if (game?.stage?.aim) {
        game.stage.aim.visible = false;
    }

    worker.onmessage = ({ data }) => {
        const { type } = data;

        if (type === 'prediction') {
            container.updateHUD(data);

            if (game?.stage?.aim && typeof game.handleClick === 'function') {
                game.stage.aim.visible = true;
                game.stage.aim.setPosition(data.x, data.y);
                const position = game.stage.aim.getGlobalPosition();

                game.handleClick({
                    global: position,
                });
            }

        }

    };

    setInterval(() => {
        worker.postMessage({
            type: 'predict',
            score: game?.score ?? 0,
        });
    }, 300);

    return container;
}
