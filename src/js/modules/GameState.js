import { Item } from './Item.js';
//Game Save Data
export const gameState = {
    energy: 100,
    application: 0,
    responses: 0,
    items: {
        automailer: new Item("automailer.bat", 50, 1),
        thinkedIn: new Item("Poster sur LinkedIn", 100, 2),
        marcelia : new Item("Marcel.ia", 500, 4),
        rhFriend: new Item("Recherche de Piston", 1000, 8),
        scriptPy: new Item("Apprendre Python",5000, 16),
        web_fetch: new Item("web_fetch.py", 14999, 32),
        hacking: new Item("Hacker 'JobApp'", 42000, 64)
    }
}

//Game saving
export function saveGame(){
    localStorage.setItem('gameSaved', JSON.stringify(gameState));
}
//Game Save Check Function
export function loadGame() {
    const saved = localStorage.getItem('gameSaved');
    if (saved) {
        const parsed = JSON.parse(saved);
        //Simples Values
        gameState.energy      = parsed.energy;
        gameState.application = parsed.application;
        gameState.responses   = parsed.responses;
        //Keys of Objects loop
        Object.keys(parsed.items).forEach(key => {
            if(gameState.items[key]) {
                gameState.items[key].count = parsed.items[key].count;
            }
        });
    }
}