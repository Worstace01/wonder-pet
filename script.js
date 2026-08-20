document.addEventListener('DOMContentLoaded', () => {
    let state = {
        hunger: 80,
        happiness: 90,
        energy: 75,
        hygiene: 85,
        xp: 45,
        level: 1,
        coins: 150,
        isSleeping: false
    };

    const els = {
        hungerBar: document.getElementById('hungerBar'),
        hungerVal: document.getElementById('hungerValue'),
        happinessBar: document.getElementById('happinessBar'),
        happinessVal: document.getElementById('happinessValue'),
        energyBar: document.getElementById('energyBar'),
        energyVal: document.getElementById('energyValue'),
        hygieneBar: document.getElementById('hygieneBar'),
        hygieneVal: document.getElementById('hygieneValue'),
        xpBar: document.getElementById('xpBar'),
        xpVal: document.getElementById('xpValue'),
        coinsDisplay: document.getElementById('coinsDisplay'),
        levelDisplay: document.getElementById('levelDisplay'),
        moodIcon: document.getElementById('moodIcon'),
        moodText: document.getElementById('moodText'),
        nightOverlay: document.getElementById('nightOverlay'),
        petCharacter: document.getElementById('petCharacter'),
        petMouth: document.getElementById('petMouth'),
        particleContainer: document.getElementById('particleContainer')
    };

    const feedBtn = document.getElementById('feedBtn');
    const playBtn = document.getElementById('playBtn');
    const sleepBtn = document.getElementById('sleepBtn');
    const washBtn = document.getElementById('washBtn');

    function updateUI() {
        if (els.hungerBar) els.hungerBar.style.width = `${state.hunger}%`;
        if (els.hungerVal) els.hungerVal.textContent = `${Math.round(state.hunger)}%`;

        if (els.happinessBar) els.happinessBar.style.width = `${state.happiness}%`;
        if (els.happinessVal) els.happinessVal.textContent = `${Math.round(state.happiness)}%`;

        if (els.energyBar) els.energyBar.style.width = `${state.energy}%`;
        if (els.energyVal) els.energyVal.textContent = `${Math.round(state.energy)}%`;

        if (els.hygieneBar) els.hygieneBar.style.width = `${state.hygiene}%`;
        if (els.hygieneVal) els.hygieneVal.textContent = `${Math.round(state.hygiene)}%`;

        if (els.xpBar) els.xpBar.style.width = `${state.xp}%`;
        if (els.xpVal) els.xpVal.textContent = `${state.xp}/100`;

        if (els.coinsDisplay) els.coinsDisplay.textContent = state.coins;
        if (els.levelDisplay) els.levelDisplay.textContent = state.level;

        updateMood();
    }

    function updateMood() {
        if (!els.moodIcon || !els.moodText || !els.petMouth) return;

        if (state.isSleeping) {
            els.moodIcon.textContent = '😴';
            els.moodText.textContent = 'Sleeping Zzz...';
            els.petMouth.setAttribute('d', 'M 90 120 Q 100 115 110 120');
            return;
        }

        const avgState = (state.hunger + state.happiness + state.energy + state.hygiene) / 4;
        if (avgState > 75) {
            els.moodIcon.textContent = '😺';
            els.moodText.textContent = 'Super Happy!';
            els.petMouth.setAttribute('d', 'M 90 115 Q 100 130 110 115');
        } else if (avgState > 40) {
            els.moodIcon.textContent = '😸';
            els.moodText.textContent = 'Doing Good';
            els.petMouth.setAttribute('d', 'M 90 118 Q 100 125 110 118');
        } else {
            els.moodIcon.textContent = '😿';
            els.moodText.textContent = 'Needs Care!';
            els.petMouth.setAttribute('d', 'M 90 125 Q 100 112 110 125');
        }
    }

    function addXP(amount) {
        state.xp += amount;
        if (state.xp >= 100) {
            state.xp -= 100;
            state.level += 1;
            state.coins += 50;
            spawnFloatingText('LEVEL UP! 🎉', '#ec4899');
        }
        updateUI();
    }

    function spawnFloatingText(text, color = '#f472b6') {
        if (!els.particleContainer) return;
        const el = document.createElement('div');
        el.className = 'absolute text-xl font-bold transition-all duration-1000 pointer-events-none z-40 animate-bounce';
        el.style.color = color;
        el.style.left = `${50 + (Math.random() * 20 - 10)}%`;
        el.style.top = `30%`;
        el.textContent = text;
        els.particleContainer.appendChild(el);

        setTimeout(() => {
            el.style.transform = 'translateY(-40px)';
            el.style.opacity = '0';
        }, 50);

        setTimeout(() => el.remove(), 1000);
    }

    // Button Listeners
    if (feedBtn) {
        feedBtn.addEventListener('click', () => {
            if (state.isSleeping) return;
            state.hunger = Math.min(100, state.hunger + 25);
            state.coins += 5;
            spawnFloatingText('+25 Food 🍔');
            addXP(15);
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (state.isSleeping) return;
            openMiniGame();
        });
    }

    if (sleepBtn) {
        sleepBtn.addEventListener('click', () => {
            state.isSleeping = !state.isSleeping;
            if (els.nightOverlay) els.nightOverlay.style.opacity = state.isSleeping ? '1' : '0';
            if (state.isSleeping) {
                state.energy = Math.min(100, state.energy + 30);
                spawnFloatingText('Sleeping... 💤', '#818cf8');
            } else {
                spawnFloatingText('Woke up! ☀️', '#fef08a');
            }
            updateUI();
        });
    }

    if (washBtn) {
        washBtn.addEventListener('click', () => {
            if (state.isSleeping) return;
            state.hygiene = Math.min(100, state.hygiene + 30);
            state.coins += 5;
            spawnFloatingText('Squeaky Clean! 🧼', '#60a5fa');
            addXP(15);
        });
    }

    if (els.petCharacter) {
        els.petCharacter.addEventListener('click', () => {
            if (state.isSleeping) return;
            state.happiness = Math.min(100, state.happiness + 5);
            spawnFloatingText('Purr~ ❤️', '#fb7185');
            updateUI();
        });
    }

    // Stat Decay Timer
    setInterval(() => {
        if (!state.isSleeping) {
            state.hunger = Math.max(0, state.hunger - 1.5);
            state.happiness = Math.max(0, state.happiness - 1);
            state.energy = Math.max(0, state.energy - 1);
            state.hygiene = Math.max(0, state.hygiene - 0.8);
        } else {
            state.energy = Math.min(100, state.energy + 2);
        }
        updateUI();
    }, 4000);

    // Mini-Game Logic
    const gameModal = document.getElementById('gameModal');
    const gameCanvas = document.getElementById('gameCanvas');
    const gameScore = document.getElementById('gameScore');
    const gameTimer = document.getElementById('gameTimer');
    const closeGameBtn = document.getElementById('closeGameBtn');

    let score = 0;
    let timer = 15;
    let gameInterval;
    let spawnInterval;

    function openMiniGame() {
        if (!gameModal || !gameCanvas) return;
        gameModal.classList.remove('hidden');
        gameModal.classList.add('flex');
        score = 0;
        timer = 15;
        if (gameScore) gameScore.textContent = score;
        if (gameTimer) gameTimer.textContent = timer;
        gameCanvas.innerHTML = '';

        gameInterval = setInterval(() => {
            timer--;
            if (gameTimer) gameTimer.textContent = timer;
            if (timer <= 0) endGame();
        }, 1000);

        spawnInterval = setInterval(spawnStar, 600);
    }

    function spawnStar() {
        if (!gameCanvas) return;
        const star = document.createElement('div');
        star.className = 'absolute text-3xl cursor-pointer select-none transition-transform active:scale-125';
        star.textContent = ['⭐', '🌟', '💖', '🍬'][Math.floor(Math.random() * 4)];
        star.style.left = `${Math.random() * 85}%`;
        star.style.top = `0px`;

        gameCanvas.appendChild(star);

        let topPos = 0;
        const fallSpeed = 3 + Math.random() * 3;
        const fallInterval = setInterval(() => {
            topPos += fallSpeed;
            star.style.top = `${topPos}px`;
            if (topPos > 210) {
                clearInterval(fallInterval);
                star.remove();
            }
        }, 30);

        star.addEventListener('click', () => {
            score += 10;
            if (gameScore) gameScore.textContent = score;
            clearInterval(fallInterval);
            star.remove();
        });
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
        if (gameModal) {
            gameModal.classList.add('hidden');
            gameModal.classList.remove('flex');
        }
        
        state.happiness = Math.min(100, state.happiness + 20);
        state.coins += score;
        addXP(score);
        spawnFloatingText(`Won +${score} Coins! 🪙`, '#facc15');
    }

    if (closeGameBtn) {
        closeGameBtn.addEventListener('click', () => {
            clearInterval(gameInterval);
            clearInterval(spawnInterval);
            if (gameModal) {
                gameModal.classList.add('hidden');
                gameModal.classList.remove('flex');
            }
        });
    }

    updateUI();
});
