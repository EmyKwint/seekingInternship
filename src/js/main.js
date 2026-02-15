import { gameState, loadGame, saveGame } from './modules/GameState.js';
import * as UI from './modules/UI.js';

//Logique Metier

const handleApply = () => {
    gameState.application++;
    gameState.energy--;
    refresh();
};

const handleCoffee = () => {
    gameState.energy += 50;
    refresh();
};

const handleBuy = (itemKey) => {
    const item = gameState.items[itemKey];
    if (gameState.application >= item.currentPrice) {
        item.buy();
        refresh();
    }
};

const handleReset = () => {
    localStorage.clear();
    location.reload();
};

//Moteur de Jeu

function refresh() {
    let autoIncrement = 0;
    Object.values(gameState.items).forEach(item => {
        autoIncrement += item.totalRate;
    });

    UI.updateStats(gameState, autoIncrement);
    UI.updateItems(gameState, handleBuy);

    // Vérification de l'overdose (Condition de défaite)
    if (gameState.energy > 300) {
        UI.toggleModal(true, handleReset);
    }
}

//Jeu
loadGame();

UI.setupEventListeners({
    onApply: handleApply,
    onCoffee: handleCoffee,
    onReset: handleReset
});

// Boucle de gain passif (1s)
setInterval(() => {
    let autoIncrement = 0;
    Object.values(gameState.items).forEach(item => {
        autoIncrement += item.totalRate;
    });
    
    gameState.application += autoIncrement;
    saveGame();
    refresh();
}, 1000);

refresh();
