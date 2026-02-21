function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function updateUserData(updatedUser) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    let users = JSON.parse(localStorage.getItem('frisbeeUsers')) || [];
    const index = users.findIndex(u => u.username === updatedUser.username);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('frisbeeUsers', JSON.stringify(users));
    }
}
(function() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        alert("This area is for members only! Please log in to play.");
        window.location.href = "./login.html";
    }
})();

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

        // updated profile stat collector
        let user = getCurrentUser();
        if (user) {
            if (!user.bestReaction || time < user.bestReaction) {
                user.bestReaction = time;
                updateUserData(user);
            }
        }
    }
};


// Loot box
const overlay = document.getElementById('overlay');
const spinBtn = document.getElementById("loot-spin");
const track = document.querySelector(".loot-track");
const carousel = document.getElementById("loot-carousel");
const result = document.getElementById("loot-result");

let isSpinning = false;

function startIdleScroll() {
    track.classList.add('idle');
}

function stopIdleScroll() {
    track.classList.remove('idle');
}

document.querySelectorAll('.game-box').forEach(box => {
    box.onclick = () => {
        const popup = document.getElementById(box.dataset.popup);
        popup.style.display = 'flex';
        overlay.style.display = 'block';

        if (popup.id === "loot-popup") {
            startIdleScroll();
        }
    };
});

overlay.onclick = () => {
    document.querySelectorAll('.hover-popup').forEach(popup => popup.style.display = 'none');
    overlay.style.display = 'none';

    isSpinning = false;
    spinBtn.disabled = false;
    startIdleScroll();
};

const rarityChances = {
    common: 40,
    uncommon: 25,
    rare: 15,
    epic: 10,
    legendary: 7,
    mythical: 3
};

function rollRarity() {
    const roll = Math.random() * 100;
    let sum = 0;

    for (const rarity in rarityChances) {
        sum += rarityChances[rarity];
        if (roll < sum) return rarity;
    }
}

spinBtn.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    stopIdleScroll();

    const items = Array.from(document.querySelectorAll(".loot-item"));
    const itemWidth = items[0].offsetWidth + 24;

    const chosenRarity = rollRarity();

    const possibleItems = items.filter(
        item => item.dataset.rarity === chosenRarity
    );

    const winningItem = possibleItems[
        Math.floor(Math.random() * possibleItems.length)
    ];

    const winIndex = items.indexOf(winningItem);

    const centerOffset = (carousel.offsetWidth / 2) - (itemWidth / 2);
    const finalX = -(winIndex * itemWidth) + centerOffset;

    track.style.transition = "transform 3s cubic-bezier(0.15, 0.8, 0.2, 1)";
    track.style.transform = `translateX(${finalX}px)`;

    track.addEventListener("transitionend", function onEnd() {
        track.style.transition = "none";
        startIdleScroll();

        const rarity = winningItem.dataset.rarity;
        const imgAlt = winningItem.querySelector("img").alt;

        result.textContent = `You won: ${imgAlt} (${rarity})`;

       
        result.className = rarity;

        isSpinning = false;
        spinBtn.disabled = false;
        let user = getCurrentUser();
        if (user) {
            const rarityWeights = { mythical: 6, legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
            const currentWeight = rarityWeights[rarity] || 0;
            const bestWeight = rarityWeights[user.bestLootRarity] || 0;

            if (currentWeight > bestWeight) {
                user.bestLootRarity = rarity;
                user.bestLootName = imgAlt;
                updateUserData(user);
            }   
        track.removeEventListener("transitionend", onEnd);
        
        }
    });
});

const probBtn = document.getElementById("prob-btn");
const probPopup = document.getElementById("prob-popup");
const probOverlay = document.getElementById("prob-overlay");
const closeProb = document.getElementById("close-prob");

probBtn.onclick = () => {
    probPopup.classList.add("show");
    probOverlay.classList.add("show");
};

closeProb.onclick = () => {
    probPopup.classList.remove("show");
    probOverlay.classList.remove("show");
};

probOverlay.onclick = () => {
    probPopup.classList.remove("show");
    probOverlay.classList.remove("show");
};

