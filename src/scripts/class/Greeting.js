export class Greeting {
    constructor(message) {
        this._message = message;
    }

    get message() {
        return this._message;
    }

    greet() {
        return this.message;
    }

    bye() {
        console.log('Goodbye!');
    }
}
