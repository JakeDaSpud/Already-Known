// Already Known by Jake O'Reilly
// https://jakedaspud.github.io/JakeDaSpud/Already-Known

// TODO Features

// FIXME

const TABS = ['experience', 'research', 'references', 'reflection', 'about'];
const DEFAULT_CHAR_MS = 60;

function showTab(name) {
    for (const t of TABS) {
        document.getElementById('tab-' + t).hidden = (t !== name);
    }

    for (const button of document.querySelectorAll('#idHeader [data-tab]')) {
        button.parentElement.classList.toggle('current-page', button.dataset.tab === name);
    }
    
    window.scrollTo(0, 0);
}

function loadExperience() {
    showTab('experience');
}

function loadResearch() {
    showTab('research');

}

function loadReferences() {
    showTab('references');

}

function loadReflection() {
    showTab('reflection');

}

function loadAbout() {
    showTab('about');

}

/* Layout of Helper

Speaking normally
Spot.say(["First line.", "Second line..."]}); 

Fast speaking
Spot.say(["First line.", "Second line..."], 10}); 

Slow speaking
Spot.say(["First line.", "Second line..."], 100}); 

Code callback after this text is done
Spot.say(["First line.", "Second line..."], 30, () => {
        showTab('experience');
    }
);

*/

// Visual Novel-esque text box code for Spot's talking
const Spot = (() => {
    const OPEN = 'assets/spot_open.png';
    const CLOSED = 'assets/spot_closed.png';
    const STARE = 'assets/spot_stare.png';
    const TWITCH = 'assets/spot_twitch.png';

    const MOUTH_MS = 150; // time between swapping sprite image

    // Loading images so they don't flicker on swap
    new Image().src = OPEN;
    new Image().src = CLOSED;
    new Image().src = STARE;
    new Image().src = TWITCH;

    const modalEl = document.getElementById('vnModal');
    const modal = new bootstrap.Modal(modalEl);
    const sprite = document.getElementById('vnSprite');
    const textEl = document.getElementById('vnText');
    const counter = document.getElementById('vnCounter');
    const backButton = document.getElementById('vnBack');
    const nextButton = document.getElementById('vnNext');

    let lines = [];
    let index = 0;
    let charMS = 30; // how long each letter takes
    let twitching = false;
    let typeTimer = null;
    let mouthTimer = null;
    let talkFrame = false;
    let onDone = null;

    const idleImg = () => twitching ? STARE : CLOSED;
    const talkImg = () => twitching ? TWITCH : OPEN;

    function stopTimers() {
        clearInterval(typeTimer);
        clearInterval(mouthTimer);
        typeTimer = null;
        mouthTimer = null;
        sprite.src = idleImg();
    }

    function showLine(i, instant = false) {
        stopTimers();
        index = i;
        const line = lines[i];
        counter.textContent = 'Page ' + (i+1) + '/' + lines.length;
        backButton.disabled = (i === 0);
        nextButton.textContent = (i === line.length-1) ? 'Close' : 'Next';

        if (instant) {
            textEl.textContent = line;
            return
        }

        textEl.textContent = '';
        let pos = 0;
        
        mouthTimer = setInterval(() => {
            talkFrame = !talkFrame;
            sprite.src = talkFrame ? talkImg() : idleImg();
        }, MOUTH_MS);

        typeTimer = setInterval(() => {
            pos++;
            textEl.textContent = line.slice(0, pos);
            if (pos >= line.length) stopTimers();
        }, charMS);
    }

    nextButton.addEventListener('click', () => {
        if (typeTimer !== null) showLine(index, true); // still typing
        else if (index < lines.length-1) showLine(index + 1);
        else modal.hide();
    });

    backButton.addEventListener('click', () => {
        if (index > 0) showLine(index-1, true);
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
        stopTimers();
        
        if (onDone) {
            const callback = onDone;
            onDone = null;
            callback();
        }
    })

    return {
        say(newLines, newCharMS = DEFAULT_CHAR_MS, callback = null) {
            lines = newLines;
            charMs = newCharMS;
            onDone = callback || null;
            sprite.src = idleImg();
            modal.show();
            showLine(0);
        },
        setTwitching(isTwitching) {
            twitching = Boolean(isTwitching);
            sprite.src = idleImg();
        }
    };
})();

function onStart() {
    Spot.setTwitching(false);
    Spot.say(["Hello, I'm Spot, your Deceptive Pattern Helper! With every Dark Pattern we encounter, I'll explain what it's doing and what it aims to achieve.", "But first, you should read the About page to figure out what is happening, then you can check out the Experience page!"], DEFAULT_CHAR_MS, () => {
        showTab('about');
    });

    loadAbout();
}

onStart();