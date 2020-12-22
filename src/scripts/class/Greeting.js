import * as _ from 'lodash-es';

export default class Greeting {
	constructor( message ) {
		this._message = message;
		this.arr = [ 1, 2, 3, 4 ];
	}

	get message() {
		const test = _.capitalize( 'test' );
		return this._message + test;
	}

	set message( m ) {
		const trimmed = _.trim( m );
		this._message = trimmed;
	}

	greet() {
		const num = _.ceil( 11, 4 );
		return `${this.message} ${num}!`;
	}

	printNumbers() {
		const joined = _.join( this.arr, ', ' );
		return _.concat( joined, [ 'test', 'hello' ] );
	}
}
