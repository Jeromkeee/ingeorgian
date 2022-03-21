/*---generate keyboard---*/

import alphabet from './alphabet.js';

const keyboard = document.querySelector('.keycontainer')

function generateboard() {
    let num = Object.values(alphabet).length;
    for (let i = 0; i < num; i++) {
        let letterGe = Object.keys(alphabet)[i];
        let letterRu = alphabet[letterGe];
        const keydiv = document.createElement('div');
        const keyletterGe = document.createElement('p');
        const keyletterRu = document.createElement('p');
        keydiv.classList.add('key', 'letter');
        keyletterGe.classList.add('keyGe');
        keyletterRu.classList.add('keyRu');
        keyboard.before(keydiv);
        keydiv.append(keyletterGe);
        keydiv.append(keyletterRu);
        keyletterGe.textContent = letterGe;
        keyletterRu.textContent = letterRu;
    }
}

window.addEventListener('load', generateboard);

/*---generate word---*/

async function getWords() {  
    const res = await fetch('./words.json');
    const data = await res.json(); 
    let dataleng = data.length;
    getOne(data, dataleng);
}

const wordboxes = document.querySelector('.wordcontainer');
let wordGe = '';

function getOne(data, dataleng) {
    let obj = data[Math.floor(Math.random() * dataleng)];
    let wordRu = Object.keys(obj);
    document.getElementById('input').textContent = wordRu;
    wordGe = obj[wordRu];
    let wordTr = wordGe.split('').map(el => alphabet[el]).join('');
    document.getElementById('translit').textContent = wordTr;
    /*document.getElementById('output').textContent = wordGe;*/
    for (let i = 0; i < wordGe.length; i++) {
        const wordbox = document.createElement('input');
        wordbox.classList.add('wordletter');
        wordbox.maxLength = 1;
        wordbox.type = "text";
        wordbox.id = `letr${i+1}`;
        wordboxes.append(wordbox);
    }
}

window.addEventListener('load', getWords);

/*---typing---*/

const letters = document.querySelector('.keyboard');
const backspace = document.getElementById('backspace');
let currentletter = 1;

function letterType(event) {
    let ltr = event.target.closest('.keyGe').textContent;
    if (currentletter < wordGe.length+1) {
        document.getElementById(`letr${currentletter}`).value = ltr;
        currentletter++
    }
}

function deleteletter() {
    if (currentletter > 1) {
        currentletter--;
        document.getElementById(`letr${currentletter}`).value = ''
    }
}

function deleteletter2(event) {
    if (event.code == 'Backspace') deleteletter();
}

    letters.addEventListener('click', letterType);
    backspace.addEventListener('click', deleteletter);
    document.addEventListener('keydown', deleteletter2);