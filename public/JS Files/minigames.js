function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}
// these lines of code are to determine if you are signed in or not. If you are, it removes the signup button.
const user = JSON.parse(localStorage.getItem('currentUser'));
if (user) {
    document.getElementById("button").classList.remove("sign")
    document.getElementById("button").style.width="0%";
    document.getElementById("button").style.height="0%";
    document.getElementById("button").innerHTML="";
}

function updateUserData(updatedUser) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    let users = JSON.parse(localStorage.getItem('frisbeeUsers')) || [];
    const index = users.findIndex(u => u.username === updatedUser.username);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('frisbeeUsers', JSON.stringify(users));
    }
}(  
    function() {
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
    const itemWidth = items[0].offsetWidth + 21.67; 

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

const questions = [
    { q: "How many players are on the field per team in a standard Ultimate game?", a: ["5", "7", "11"], correct: 1 },
    { q: "What is the most common throw?", a: ["Backhand", "Forehand/Flick", "Hammer"], correct: 0 },
    { q: "A goal is scored when you catch the disc in the...", a: ["Endzone", "Midfield", "Sideline"], correct: 0 },
    { q: "How long does a player have to throw the disc (Stall count)?", a: ["5 seconds", "10 seconds", "15 seconds"], correct: 1 },
    { q: "Is Ultimate Frisbee a contact sport?", a: ["Yes", "No", "Only on defense"], correct: 1 },
    { q: "What is it called when a defender guards the person with the disc?", a: ["Blocking", "Stalling", "Marking"], correct: 2 },
    { q: "Which throw uses a 'pincer' grip with the index and middle finger?", a: ["Backhand", "Forehand", "Scoober"], correct: 1 },
    { q: "Can you run while holding the frisbee?", a: ["Yes", "No", "Only 3 steps"], correct: 1 },
    { q: "What happens if the disc hits the ground?", a: ["Redo the throw", "Turnover", "Penalty"], correct: 1 },
    { q: "Who is responsible for officiating the game?", a: ["The Players", "A Referee", "The Coach"], correct: 0 },
    { q: "What is the name of a high overhead throw where the disc flies upside down?", a: ["Hail Mary", "Tomahawk", "Hammer", "Backhand"], correct: 2 },
    { q: "What is it called when a thrower moves their pivot foot before throwing?", a: ["Traveling", "Double Dribble", "Foot Fault"], correct: 0 },
    { q: "A 'Pull' in Ultimate Frisbee is equivalent to a...?", a: ["Jump ball", "Kickoff", "Home run"], correct: 1 },
    { q: "What is the name of the offensive strategy where players line up in a single file down the middle?", a: ["Horizontal Stack", "Vertical Stack", "Zone Defense"], correct: 1 },
    { q: "If the defense catches the disc, it is called an interception. What happens next?", a: ["Game pause", "The defense immediately becomes offense", "The point ends"], correct: 1 },
    { q: "What is a 'Sky' in Frisbee terms?", a: ["A very high throw", "Catching the disc at a higher point than your opponent", "The frisbee landing on a roof"], correct: 1 },
    { q: "How many timeouts does each team usually get per half?", a: ["One", "Two", "Unlimited"], correct: 1 },
    { q: "What is 'Spirit of the Game'?", a: ["A type of drink", "The sportsmanship and self-refereeing philosophy", "A halftime cheer"], correct: 1 },
    { q: "What is a 'Layout'?", a: ["The field dimensions", "Diving to catch or block the disc", "Planning the next play"], correct: 1 },
    { q: "A 'Huck' is defined as:", a: ["A short dump pass", "A long downfield throw", "Dropping the disc accidentally"], correct: 1 }
];

let currentQuestionIndex = 0;
let score = 0;

const qaIntro = document.getElementById("qa-intro");
const qaGame = document.getElementById("qa-game");
const startQaBtn = document.getElementById("start-qa-btn");
const questionContainer = document.getElementById("qa-questions");
const scoreDisplay = document.getElementById("qa-score");


startQaBtn.onclick = () => {
    qaIntro.style.display = "none";
    qaGame.style.display = "block";
    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = score;
    showQuestion();
};

function showQuestion() {
    questionContainer.innerHTML = "";
    const data = questions[currentQuestionIndex];

    const qText = document.createElement("p");
    qText.textContent = `${currentQuestionIndex + 1}. ${data.q}`;
    questionContainer.appendChild(qText);

    data.a.forEach((ans, index) => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.className = "qa-option-btn";
        btn.onclick = () => checkAnswer(index);
        questionContainer.appendChild(btn);
    });
}

function checkAnswer(index) {
    if (index === questions[currentQuestionIndex].correct) {
        score++;
        scoreDisplay.textContent = score;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    questionContainer.innerHTML = `<h3>Quiz Complete!</h3><p>Final Score: ${score} / ${questions.length}</p>`;
    
    let user = getCurrentUser();
    if (user) {
        if (!user.bestQaScore || score > user.bestQaScore) {
            user.bestQaScore = score;
            updateUserData(user);
        }
    }

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Try Again";
    restartBtn.onclick = () => {
        currentQuestionIndex = 0;
        score = 0;
        scoreDisplay.textContent = score;
        showQuestion();
    };
    questionContainer.appendChild(restartBtn);
}
