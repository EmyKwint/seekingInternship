
export class Item {
    constructor(name, basePrice, rate, count = 0) {
        this.name      = name;
        this.basePrice = basePrice;
        this.rate      = rate;
        this.count     = count;
    }
    //Methods & Getters
    get currentPrice() {
        return Math.floor(this.basePrice * Math.pow(1.5, this.count));
    }
    get totalRate() {
        return this.rate * this.count;
    }
    buy() {
        this.count++;
        console.log("acheté");
    }
}