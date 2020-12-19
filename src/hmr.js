// Initial import
import './main.js';

// Accept module for Hot module reload
if (module && module.hot) {
	module.hot.accept('./main.js', () => {
		console.log('Accepting module, updating...');
	});
}
