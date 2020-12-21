// Font imports in "./stylesheets/base/_fonts.sass"

// Styles
import './stylesheets/main.sass';

// Icons
import './assets/icons/icon-airplane.svg';
import './assets/icons/icon-compass.svg';
import './assets/icons/icon-earth.svg';
import './assets/icons/icon-facebook.svg';
import './assets/icons/icon-heart.svg';
import './assets/icons/icon-instagram.svg';
import './assets/icons/icon-search.svg';
import './assets/icons/icon-sun.svg';
import './assets/icons/icon-twitter.svg';

// Images
import './assets/images/img-bg-adventure.jpg';
import './assets/images/img-connect.jpg';
import './assets/images/img-forest.jpg';
import './assets/images/img-sea.jpg';
import './assets/images/img-snow.jpg';

import './scripts/index';

// Only files accepted here will be hot replaced.
// When making changes in this file be sure to reload the page.
if (module && module.hot) {
    module.hot.accept('./scripts/index.js', function () {
        console.log('Module Accepted.');
    });
}
