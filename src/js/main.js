/******************\ 
*Class/Objects/Vars*
\******************/
//Game Stats
const applyCounter  = document.querySelector('#score');
const energyCounter = document.querySelector('#energy');
const gainCounter   = document.querySelector('#gain');
const responsesCounter = document.querySelector('#response');
//Game Component
const applyBtn     = document.querySelector('#sendRequest');
const coffeeBtn    = document.querySelector('#takeBreak');
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
//Class for interview
class Interview {
    constructor(id, name, string) {
        this.id     = id;
        this.name   = name;
        this.string = string;
    }
}

//Game State
let gameState = {
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
    energyCounter.innerText = gameState.energy;
    //Item Update loop
    Object.keys(gameState.items).forEach(key => {
        const item = gameState.items[key];
        let btn  = document.querySelector(`#${key}`);
        //Item Btn Generation
        if(!btn && (gameState.application >= item.basePrice || item.count > 0)) {
            btn    = document.createElement('button');
            btn.id = key;
            btn.classList = "btn";
            document.querySelector('#content').appendChild(btn);
            //Btn Buy Event
            btn.addEventListener('click', () => {
                buyItem(key);
            })
        }
        //Item Update
        if(btn) {
            const price = item.CurrentPrice;
            const rate  = item.totalRate;
            //Text Update
            btn.innerText = `${item.name} (${price} candidatures requises) - Itérations : ${item.count}, + ${rate}/sec`;
            btn.disabled  = gameState.application < price;
        }
    });
    //Energy Check
    isMyHeartGood();
    amIOk();
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
    gainCounter.innerText  = autoIncrement;
}
//Energy joke (301% u go to hospital)
function isMyHeartGood() {
    if(gameState.energy > 199) {
        openModal();  
        
        modalBtn.addEventListener('click', () => {
        modal.style.display = "none";
        localStorage.clear();
        location.reload();
        });
    }
}
//Get some rest
function amIOk() {
    applyBtn.disabled = gameState.energy < 1;
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
//Coffee machine is up
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
