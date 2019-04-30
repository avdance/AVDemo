/* jshint browser: true */
import {sendUrlRequest} from './sendUrlRequest';
import {HelloWorld} from './HelloWorld';

export function startHelloWorld(){
    console.log('Start hello world!');
}

export function stopHelloWorld(){
    console.log('Stop hello world!');
}

export{HelloWorld, sendUrlRequest};

var helloVar = 1;

export {helloVar};