import { Greeting } from './class/Greeting';
import { cube } from './utils/math';

const Hello = new Greeting('Hello World');
Hello.greet();

function component() {
    const element = document.createElement('pre');
    element.innerHTML = ['Hello webpack!', '5 cubed is equal to ' + cube(5)].join('\n\n');
    return element;
}

document.body.appendChild(component());
