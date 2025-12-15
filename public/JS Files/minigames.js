// Reaction time test

const frisbee = document.getElementById("reaction-circle");
const startBtn = document.getElementById("reaction-start");
const reactionResult = document.getElementById("reaction-result");

let state = "idle";
let startTime = 0;
let readyTimeout;
let failTimeout;

startBtn.onclick = () => {
    if (state !== "idle") return; // start of idle spinning animation

    reactionResult.textContent = "Wait...";
    frisbee.classList.add("spinning");
    frisbee.classList.remove("stopped");
    state = "waiting";

    const delay = Math.random() * 3000 + 1000; // when to click

    readyTimeout = setTimeout(() => {
        startTime = performance.now();
        reactionResult.textContent = "CLICK!";
        state = "ready";
        
        failTimeout = setTimeout(() => {
            frisbee.classList.remove("spinning");
            frisbee.classList.add("stopped");
            reactionResult.textContent = "Too slow!";
            state = "idle";
        }, 500);
    }, delay);
};


frisbee.onclick = () => {
    // if clicked early
    if (state === "waiting") {
        clearTimeout(readyTimeout);
        frisbee.classList.remove("spinning");
        frisbee.classList.add("stopped");
        reactionResult.textContent = "Too early!";
        state = "idle";
    }
    // if clicked on time
    else if (state === "ready") {
        clearTimeout(failTimeout);
        const time = Math.round(performance.now() - startTime);
        frisbee.classList.remove("spinning");
        frisbee.classList.add("stopped");
        reactionResult.textContent = `Reaction Time: ${time} ms`;
        state = "idle";
    }
};


frisbee.onclick = () => {
    if (state === "waiting") {
        clearTimeout(readyTimeout);
        frisbee.classList.remove("spinning");
        frisbee.classList.add("stopped");
        reactionResult.textContent = "Too early!";
        state = "idle";
    }

    else if (state === "ready") {
        clearTimeout(failTimeout);
        const time = Math.round(performance.now() - startTime);
        frisbee.classList.remove("spinning");
        frisbee.classList.add("stopped");
        reactionResult.textContent = `Reaction Time: ${time} ms`;
        state = "idle";
    }
};


// Loot box
const overlay = document.getElementById('overlay');
const spinBtn = document.getElementById("loot-spin");
const track = document.querySelector(".loot-track");
const carousel = document.getElementById("loot-carousel");
const result = document.getElementById("loot-result");
let scrollX = 0;
let idleAnim = null;
let isSpinning = false;

// idle infinite scroll animation
function startIdleScroll() {
    function idle() {
        if (!isSpinning) {
            scrollX -= 1;
            const width = track.scrollWidth / 2;
            if (Math.abs(scrollX) >= width) scrollX = 0;
            track.style.transform = `translateX(${scrollX}px)`;
        }
        idleAnim = requestAnimationFrame(idle);
    }
    if (!idleAnim) idle();
}

function startIdleScroll() {
    track.classList.add('idle');   // start idle animation visually
}

function stopIdleScroll() {
    track.classList.remove('idle'); // stop idle animation visually
}
const lootPopup = document.getElementById("loot-popup");

document.querySelectorAll('.game-box').forEach(box => {
    box.onclick = () => {
        const popup = document.getElementById(box.dataset.popup);
        popup.style.display = 'flex';
        overlay.style.display = 'block';

        if (popup.id === "loot-popup") {
            startIdleScroll();
        }
    }
});

overlay.onclick = () => {
    document.querySelectorAll('.hover-popup').forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';

    // reset loot box spin state if closing while spinning
    isSpinning = false;
    spinBtn.disabled = false;

    // reset idle scroll 
    track.style.transition = "none";
    startIdleScroll();
};

spinBtn.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    stopIdleScroll();

    const items = document.querySelectorAll(".loot-item");
    const itemWidth = items[0].offsetWidth + 24;
    const winIndex = Math.floor(Math.random() * items.length);
    const centerOffset = (carousel.offsetWidth / 2) - (itemWidth / 2);
    const finalX = -(winIndex * itemWidth) + centerOffset;

    // spin animation
    track.style.transition = "transform 3s cubic-bezier(0.15, 0.8, 0.2, 1)";
    track.style.transform = `translateX(${finalX}px)`;

    track.addEventListener('transitionend', function onTransitionEnd() {
        track.style.transition = "none"; 
        // restart idle scroll
        startIdleScroll();

        // show result after spin ends
        const winningItem = items[winIndex];
        const rarity = winningItem.dataset.rarity;
        const imgAlt = winningItem.querySelector('img').alt;
        result.textContent = `You won:  ${imgAlt} (${rarity})`;
        result.className = rarity;

        isSpinning = false;
        spinBtn.disabled = false;

        track.removeEventListener('transitionend', onTransitionEnd);
    });
});

// probability table
const probBtn = document.getElementById("prob-btn");
const probPopup = document.getElementById("prob-popup");
const probOverlay = document.getElementById("prob-overlay");
const closeProb = document.getElementById("close-prob");

probBtn.addEventListener("click", () => {
    probPopup.classList.add("show");
    probOverlay.classList.add("show");
});

closeProb.addEventListener("click", () => {
    probPopup.classList.remove("show");
    probOverlay.classList.remove("show");
});

probOverlay.addEventListener("click", () => {
    probPopup.classList.remove("show");
    probOverlay.classList.remove("show");
});

