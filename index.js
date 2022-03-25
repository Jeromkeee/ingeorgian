/*---generate keyboard---*/

import alphabet from './alphabet.js';

const keyboard = document.querySelector('.keyboard');
let mode = 'easy';

function generateboard() {
    if (mode === 'easy') switcherelem.forEach(elem => elem.classList.add('hideswitcher'));
    let num = Object.values(alphabet).length;
    for (let i = 0; i < num; i++) {
        let letterGe = Object.keys(alphabet)[i];
        let letterRu = alphabet[letterGe];
        const keydiv = document.createElement('div');
        const keyletterGe = document.createElement('p');
        const keyletterRu = document.createElement('p');
        keydiv.classList.add('key', 'letter');
        keyletterGe.classList.add('keyGe');
        if (mode === 'easy') keyletterRu.classList.add('keyRu');
        if (mode === 'regular') keyletterRu.classList.add('keyRu', 'showRu');
        keyboard.append(keydiv);
        keydiv.append(keyletterGe);
        keydiv.append(keyletterRu);
        keyletterGe.textContent = letterGe;
        keyletterRu.textContent = letterRu;
    }
}

window.addEventListener('load', generateboard);
window.screen.orientation.lock('portrait')

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

/*---clearform---*/

const btton = document.getElementById('gen')

function regenform() {
    while (wordboxes.firstChild) wordboxes.removeChild(wordboxes.firstChild)
    currentletter = 1
    getWords()
}

btton.addEventListener('click', regenform);

/*---typing---*/

const backspace = document.getElementById('backspace');
const delall = document.getElementById('delAll');
let currentletter = 1;

function letterType(event) {
    let ltr = event.target.closest('.letter').querySelector('.keyGe').textContent;
    if (currentletter < wordGe.length+1) {
        document.getElementById(`letr${currentletter}`).value = ltr;
        currentletter++
    }
    if (currentletter == wordGe.length+1) checkResult()
}

function deleteletter() {
    if (currentletter > 1) {
        currentletter--;
        document.getElementById(`letr${currentletter}`).value = ''
    }
    for (let i = 0; i < wordGe.length; i++) {
            document.getElementById(`letr${i+1}`).classList.remove('wrongletter')
    }
}

function deleteletterkey(event) {
    if (event.code == 'Backspace') deleteletter();
}

function clearall() {
    while (currentletter > 1) deleteletter();
}

    keyboard.addEventListener('click', letterType);
    backspace.addEventListener('click', deleteletter);
    delall.addEventListener('click', clearall);
    document.addEventListener('keydown', deleteletterkey);


/*---checking---*/

function checkResult() {
    let typeword = '';
    for (let i = 1; i < wordGe.length+1; i++) typeword += document.getElementById(`letr${i}`).value;
    for (let i = 0; i < wordGe.length; i++) {
        if (typeword.charAt(i) !== wordGe.charAt(i)) {
            document.getElementById(`letr${i+1}`).classList.add('wrongletter')
        }
    }
    if (typeword === wordGe) {
        for (let i = 1; i < wordGe.length+1; i++) document.getElementById(`letr${i}`).classList.add('correct');
        setTimeout(regenform, 900)
    }
}

/*---mode switchers---*/

const switcherelem = document.querySelectorAll('.help-button, .text-helper');
const switcher = document.getElementById('helper');
const modebtn = document.getElementById('mode');
const tmbox = document.querySelector('.tmbox');

function hidetranslit() {
    const transltRu = document.querySelectorAll('.keyRu');
    transltRu.forEach(elem => elem.classList.add('showRu'));
    switcher.classList.remove('active');
    document.querySelector('.help-bgr').classList.add('hideswitcher');
}

function showtranslit() {
    const transltRu = document.querySelectorAll('.keyRu');
    transltRu.forEach(elem => elem.classList.remove('showRu'));
    switcher.classList.add('active');
    document.querySelector('.help-bgr').classList.remove('hideswitcher');
    setTimeout(hidetranslit, 1500)
}

function switchmode () {
    const transltRu = document.querySelectorAll('.keyRu');
    if (mode === 'easy') {
        mode = 'regular';
        transltRu.forEach(elem => elem.classList.add('showRu'));
        switcherelem.forEach(elem => elem.classList.remove('hideswitcher'));
        tmbox.classList.add('easy')
        setTimeout(() => tmbox.classList.remove('easy'), 1000)
    } else {
        mode = 'easy';
        transltRu.forEach(elem => elem.classList.remove('showRu'));
        switcherelem.forEach(elem => elem.classList.add('hideswitcher'));
        tmbox.classList.add('regular')
        setTimeout(() => tmbox.classList.remove('regular'), 1000)
    }
}

modebtn.addEventListener('click', switchmode);
switcher.addEventListener('click', showtranslit);

/*---about---*/

const aboutbtn = document.getElementById('about');
const aboutclose = document.querySelector('.xmark');

function showabout() {
    document.querySelector('.about-box').classList.add('active')
}
function closeabout() {
    document.querySelector('.about-box').classList.remove('active')
}

aboutbtn.addEventListener('click', showabout);
aboutclose.addEventListener('click', closeabout);

/*---solve problem---*/
document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
  }, false);