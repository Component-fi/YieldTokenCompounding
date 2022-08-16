import { Buffer } from 'buffer';

window.global = window.global ?? window;
//@ts-ignore
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

export {};