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
}

export class Bye {
	bye() {
		console.log("Goodbye!");
	}
}
