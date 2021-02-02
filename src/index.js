// Font imports in "./stylesheets/base/_fonts.sass"

// Styles
import './stylesheets/main.sass';

import './assets/images/header.jpg';
import './assets/images/footer.jpg';
import './assets/images/step-1.jpg';
import './assets/images/step-2.jpg';
import './assets/images/step-3-4.jpg';

// Only files accepted here will be hot reloaded.
// When making changes in this file be sure to reload the page.
if ( module && module.hot ) {
	module.hot.accept( './scripts/index.js', () => 'Module accepted.' );
}
