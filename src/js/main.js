/******************\ 
*Class/Objects/Vars*
\******************/
//Game Stats
const applyCounter  = document.querySelector('#applyCounter');
const energyCounter = document.querySelector('#energyCounter');
const responsesCounter = document.querySelector('#responsesCounter');
//Game Component
const applyBtn     = document.querySelector('#applyBtn');
const coffeeBtn    = document.querySelector('#coffee');
//Class for Items
class Item {
    constructor(name, basePrice, rate) {
        this.name      = name;
        this.basePrice = basePrice;
        this.rate      = rate;
        this.count     = 0;
    }
    //Methods & Getters
    get CurrentPrice() {
        return Math.floor(this.basePrice * Math.pow(1.5, this.count));
    }
    get totalRate() {
        return this.rate * this.count;
    }
    buy() {
        this.count++;
    }
}
//Game State
let gameState = {
    energy: 100,
    application: 0,
    responses: 0,
    items: {
        automailer: new Item("Automailer", 15, 1),
        linkedIn: new Item("LinkedIn", 150, 2),
        Marcelia : new Item("Marcel.ia", 300, 10),
        rhFriend: new Item("Ton ami RH", 500, 20)
    }
}
/******************\ 
********Modal*******
\******************/
const modal    = document.querySelector('#modal');
const modalBtn = document.querySelector('#modalBtn'); 

function openModal() {
    modal.style.display = "flex";
};
/******************\ 
******Functions*****
\******************/

//Game Save Check Function
function loadGame() {
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
//Buy Items
function buyItem(itemKey) {
    const item  = gameState.items[itemKey];
    const price = item.CurrentPrice;
    //Buy That Update
    if (gameState.application >= price) {
        item.buy();
        updateUi();
    }
}
//Update Ui
function updateUi() {
    //Update Stats
    applyCounter.innerText  = gameState.application;
    energyCounter.innerText = gameState.energy + "%";
    //Item Update loop
    Object.keys(gameState.items).forEach(key => {
        const item = gameState.items[key];
        let btn  = document.querySelector(`#${key}`);
        //Item Btn Generation
        if(!btn && (gameState.application >= item.basePrice || item.count > 0)) {
            btn    = document.createElement('button');
            btn.id = key;
            document.querySelector('#tools').appendChild(btn);
            //Btn Buy Event
            btn.addEventListener('click', () => {
                buyItem(key);
            })
        }
        //Item Update
        if(btn) {
            const price = item.CurrentPrice;
            //Text Update
            btn.innerText = `${item.name} (${price} candidatures requises) - Itérations : ${item.count}`;
            btn.disabled  = gameState.application < price;
        }
    });
    isMyHeartGood();
    //Game saving
    localStorage.setItem('gameSaved', JSON.stringify(gameState));
}
//No-Click Addiction Machine
function itemIncrementation() {
    let autoIncrement = 0;
    //Calculing auto++
    Object.keys(gameState.items).forEach(key => {
        const mult    = gameState.items[key].totalRate;
        //Addiction setUp
        autoIncrement += mult;
    });
    //Release dopamine
    gameState.application += autoIncrement;
}
//Energy joke (200% u go to hospital)
function isMyHeartGood() {
    if(gameState.energy > 300) {
        openModal();  
        
        modalBtn.addEventListener('click', () => {
        modal.style.display = "none";
        localStorage.clear();
        location.reload();
        });
    }
}

/*****************\ 
* GamePlayScripts *
\*****************/

//Incremental Click
applyBtn.addEventListener('click', () => {
    gameState.application ++;
    gameState.energy --;
    updateUi();
})
//Get a coffee
coffeeBtn.addEventListener('click', () => {
    gameState.energy += 50;
    coffeeBtn.disabled = true;
    updateUi();
})
//Init save, update Ui
loadGame();
updateUi();
//Check autoIncr
setInterval(() => {
    itemIncrementation();
    updateUi();
},  1000);
//Check coffee
setInterval(() => {
    coffeeBtn.disabled = false;
    updateUi();
},  (60*1000));

//DEVZONE//
const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
})
