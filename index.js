/*---generate keyboard---*/

import alphabet from './alphabet.js';

const keyboard = document.querySelector('.keyboard');
let mode = 'easy';
let keymode = 'stable';
let num = Object.values(alphabet).length;
let RandomArr = [];
for (let i = 0; i < num; i++) RandomArr.push(i)

function generateboard() {
    if (mode === 'easy') switcher.classList.add('hideswitcher');
    if (keymode === 'random') {
        for (let i = 0; i < num; i++) {
            let randel = Math.floor(Math.random() * (num-i));
            RandomArr.push(RandomArr[randel]);
            RandomArr.splice(randel, 1);
        }
    }
    for (let i = 0; i < num; i++) {
        let letterGe = Object.keys(alphabet)[RandomArr[i]];
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
    let Width = window.innerWidth;
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
        if (wordGe.length > 8) {
            wordbox.style.width = `${Width/wordGe.length - 6}px`;
            wordbox.style.fontSize = `${28 + Width/wordGe.length**1.8}px`;
        }
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
    if (keymode === 'random') {
        while (keyboard.firstChild) keyboard.removeChild(keyboard.firstChild)
        generateboard()
    }
}

btton.addEventListener('click', regenform);

/*---play audio---*/

const audio = new Audio();
const lessonletters = document.querySelectorAll('.keylesson');

function letterAudio(event) {
    let ltrk = event.target.closest('.lettercard').querySelector('.keyGe').textContent;
    let ltrn = Object.keys(alphabet).indexOf(ltrk) + 1
    audio.src = `./audio/${ltrn}.mp3`;
    audio.currentTime = 0;
    audio.play();
}

for (let i = 0; i < lessonletters.length; i++) {
    lessonletters[i].addEventListener('click', letterAudio)
}

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

/*---mode switcher---*/

const modebtn = document.getElementById('modebtn');
const modebox = document.getElementById('modebox');

function switchmode () {
    const transltRu = document.querySelectorAll('.keyRu');
    if (mode === 'easy') {
        mode = 'regular';
        transltRu.forEach(elem => elem.classList.add('showRu'));
        switcher.classList.remove('hideswitcher');
        modebox.classList.add('fromleft')
        setTimeout(() => modebox.classList.remove('fromleft'), 1000)
    } else {
        mode = 'easy';
        transltRu.forEach(elem => elem.classList.remove('showRu'));
        switcher.classList.add('hideswitcher');
        modebox.classList.add('fromright')
        setTimeout(() => modebox.classList.remove('fromright'), 1000)
    }
}

modebtn.addEventListener('click', switchmode);

/*---font switcher---*/

const fontbtn = document.getElementById('fontbtn');
const fontbox = document.getElementById('fontbox');
let font = 'Serif';

function switchfont () {
    if (font === 'Serif') {
        font = 'Sans';
        document.documentElement.style.setProperty('--fontGe', 'NotoSansGeorgian');
        fontbox.classList.add('fromleft')
        setTimeout(() => fontbox.classList.remove('fromleft'), 1000)
    } else {
        font = 'Serif';
        document.documentElement.style.setProperty('--fontGe', 'NotoSerifGeorgian');
        fontbox.classList.add('fromright')
        setTimeout(() => fontbox.classList.remove('fromright'), 1000)
    }
}

fontbtn.addEventListener('click', switchfont);

/*---keybd switcher---*/

const keybdbtn = document.getElementById('keybdbtn');
const keybdbox = document.getElementById('keybdbox');

function switchkeybd () {
    if (keymode === 'stable') {
        keymode = 'random';
        keybdbox.classList.add('fromleft')
        setTimeout(() => keybdbox.classList.remove('fromleft'), 1000)
    } else {
        keymode = 'stable';
        keybdbox.classList.add('fromright')
        setTimeout(() => keybdbox.classList.remove('fromright'), 1000)
    }
}

keybdbtn.addEventListener('click', switchkeybd);

/*---showtranslit---*/

const switcher = document.getElementById('helper');

function hidetranslit() {
    const transltRu = document.querySelectorAll('.keyRu');
    transltRu.forEach(elem => elem.classList.add('showRu'));
    switcher.classList.remove('active');
}

function showtranslit() {
    const transltRu = document.querySelectorAll('.keyRu');
    transltRu.forEach(elem => elem.classList.remove('showRu'));
    switcher.classList.add('active');
    setTimeout(hidetranslit, 1800)
}

switcher.addEventListener('click', showtranslit);

/*---about---*/

const aboutbtn = document.getElementById('about');
const aboutclose = document.getElementById('Xabout');

function showabout() {
    document.querySelector('.about-box').classList.add('active')
}
function closeabout() {
    document.querySelector('.about-box').classList.remove('active')
}

aboutbtn.addEventListener('click', showabout);
aboutclose.addEventListener('click', closeabout);

/*---lessons---*/

let currentcard = 0
const lessonsbtn = document.getElementById('lessons');
const lessonsclose = document.getElementById('Xlessons');
const prevcardbtn = document.getElementById('prevcard');
const nextcardbtn = document.getElementById('nextcard');
const allcards = document.querySelectorAll('.lesson');

function nextcard() {
    allcards[currentcard].classList.add('active')
    prevcardbtn.classList.remove('hideswitcher')
    function gonext() {
        allcards[currentcard].classList.remove('active')
        allcards[currentcard].classList.add('disable')
        allcards[currentcard + 1].classList.remove('disable')
        currentcard++ 
        if (currentcard + 1 === allcards.length) nextcardbtn.classList.add('hideswitcher')
    }
    setTimeout(gonext, 200)  
}

function prevcard() {
    allcards[currentcard].classList.add('active')
    nextcardbtn.classList.remove('hideswitcher')
    function goprev() {
        allcards[currentcard].classList.remove('active')
        allcards[currentcard].classList.add('disable')
        allcards[currentcard - 1].classList.remove('disable')
        currentcard--
        if (currentcard === 0) prevcardbtn.classList.add('hideswitcher')
    }
    setTimeout(goprev, 200)
}

function showlessons() {
    document.querySelector('.lessons-box').classList.add('active')
}
function closelessons() {
    document.querySelector('.lessons-box').classList.remove('active')
}

lessonsbtn.addEventListener('click', showlessons);
lessonsclose.addEventListener('click', closelessons);
nextcardbtn.addEventListener('click', nextcard);
prevcardbtn.addEventListener('click', prevcard);

/*---settings---*/

const settingsbtn = document.getElementById('settings');
const settingsclose = document.getElementById('Xsettings');
const settingsclose2 = document.getElementById('Tsettings');

function showsettings() {
    document.querySelector('.settings-box').classList.add('active')
}
function closesettings() {
    document.querySelector('.settings-box').classList.remove('active')
}

settingsbtn.addEventListener('click', showsettings);
settingsclose.addEventListener('click', closesettings);
settingsclose2.addEventListener('click', closesettings);
/*---solve scale problem on phone---*/
document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
  }, false);