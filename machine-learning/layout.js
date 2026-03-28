export function buildLayout() {
    const hud = document.createElement('div');
    hud.style.position = 'fixed';
    hud.style.top = '16px';
    hud.style.right = '16px';
    hud.style.zIndex = '1000';
    hud.style.padding = '10px 12px';
    hud.style.borderRadius = '8px';
    hud.style.background = 'rgba(0, 0, 0, 0.65)';
    hud.style.color = '#ffffff';
    hud.style.fontFamily = 'monospace';
    hud.style.lineHeight = '1.4';

    const scoreText = document.createElement('div');
    scoreText.textContent = 'Score: 0';
    scoreText.style.fontSize = '16px';

    const predictionsText = document.createElement('div');
    predictionsText.textContent = '🍎 Apple prediction: n/a';
    const bombText = document.createElement('div');
    bombText.textContent = '💣 Bomb prediction: n/a';
    predictionsText.style.fontSize = '13px';
    bombText.style.fontSize = '13px';

    hud.appendChild(scoreText);
    hud.appendChild(predictionsText);
    hud.appendChild(bombText);
    document.body.appendChild(hud);

    function updateHUD(data) {
        const score = Number.isFinite(data.score) ? data.score : 0;
        const appleX = Number.isFinite(data.appleX) ? Math.round(data.appleX) : 'n/a';
        const appleY = Number.isFinite(data.appleY) ? Math.round(data.appleY) : 'n/a';
        const bombX = Number.isFinite(data.bombX) ? Math.round(data.bombX) : 'n/a';
        const bombY = Number.isFinite(data.bombY) ? Math.round(data.bombY) : 'n/a';
        scoreText.textContent = `Score: ${score}`;
        predictionsText.textContent = `🍎 Apple prediction: (${appleX}, ${appleY})`;
        bombText.textContent = `💣 Bomb prediction: (${bombX}, ${bombY})`;
    }

    return {
        updateHUD,
    };
}