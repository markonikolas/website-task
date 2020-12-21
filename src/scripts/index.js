import { utils } from './utils/util';
import { Greeting } from './class/Greeting';

const title = new Greeting('Hello World');

document.querySelector('.starter__title').innerHTML = title.greet() + ' !';

utils();
