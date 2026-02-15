//DOM
const dom = {
    applyCounter: document.querySelector('#score'),
    energyCounter: document.querySelector('#energy'),
    gainCounter: document.querySelector('#gain'),
    responsesCounter: document.querySelector('#response'),
    applyBtn: document.querySelector('#sendRequest'),
    coffeeBtn: document.querySelector('#takeBreak'),
    modal: document.querySelector('#modal'),
    modalBtn: document.querySelector('#modalBtn'),
}

//MaJ UI
export function updateStats(gameState, currentGain) {
    dom.applyCounter.innerText  = gameState.application;
    dom.energyCounter.innerText = gameState.energy;
    dom.gainCounter.innerText   = currentGain;
    dom.applyBtn.disabled       = gameState.energy < 1; 
}

//Item Update loop
export function updateItems(gameState, buyCallBack) {
        const content =  document.querySelector('#content'); 
        Object.keys(gameState.items).forEach(key => {
        const item = gameState.items[key];
        let btn  = document.querySelector(`#${key}`);
        //Item Btn Generation
        if(!btn && (gameState.application >= item.basePrice || item.count > 0)) {
            btn    = document.createElement('button');
            btn.id = key;
            btn.classList = "btn";
            content.appendChild(btn);
            //Btn Buy Event
            btn.addEventListener('click', () => buyCallBack(key));
        }
        //Item Text Update
        if(btn) {
            btn.innerText = `${item.name} (${item.currentPrice} candidatures requises) - Itérations : ${item.count}, + ${item.totalRate}/sec`;
            btn.disabled  = gameState.application < item.currentPrice;
        }
    });
}

export function toggleModal(show, onConfirm) {
    dom.modal.style.display = show ? "flex" : "none";
    if (show) {
        const modalBtn = document.querySelector('#modalBtn');
        modalBtn.onclick = onConfirm;
    }
}

export function setupEventListeners(callbacks) {
    // Bouton Envoyer une demande
    dom.applyBtn.addEventListener('click', () => {
        callbacks.onApply();
    });

    // Bouton Pause café
    dom.coffeeBtn.addEventListener('click', () => {
        callbacks.onCoffee();
    });

    // Bouton Reset (Dev Zone)
    const resetBtn = document.querySelector('#reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if(confirm("Voulez-vous vraiment recommencer à zéro ?")) {
                callbacks.onReset();
            }
        });
    }
}