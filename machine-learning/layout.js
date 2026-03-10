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
    predictionsText.textContent = 'Predictions: n/a';
    predictionsText.style.fontSize = '13px';

    hud.appendChild(scoreText);
    hud.appendChild(predictionsText);
    document.body.appendChild(hud);

    function updateHUD(data) {
        const score = Number.isFinite(data.score) ? data.score : 0;
        const x = Number.isFinite(data.x) ? Math.round(data.x) : 'n/a';
        const y = Number.isFinite(data.y) ? Math.round(data.y) : 'n/a';
        scoreText.textContent = `Score: ${score}`;
        predictionsText.textContent = `Predictions: (${x}, ${y})`;
    }

    return {
        updateHUD,
    };
}