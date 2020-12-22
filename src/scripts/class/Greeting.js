export default class Greeting {
	constructor( message ) {
		this.message = message;
	}

	set message( message ) {
		this.message = message;
	}

	get message() {
		return this.message;
	}

	greet() {
		return `${this.message} !`;
	}
}
