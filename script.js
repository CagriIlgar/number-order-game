console.log("Script Working");

const main = document.getElementById('main');
const randomDiv = document.getElementById("numberContainer");
const randomNF = document.getElementById("randomNumberField");
const restartBtn = document.getElementById("restartBtn");
const h3Container = document.getElementById("h3Container");
const youLost = document.getElementById('youLost');
const youWin = document.getElementById('youWin');
const timerDisplay = document.getElementById('timer');
const bestTimeDisplay = document.getElementById('bestTime');

let fieldNumber = 20;
let urlParams = new URLSearchParams(window.location.search);
let difficulty = urlParams.get('difficulty');
let startTime, timerInterval;
let bestTime = localStorage.getItem(`bestTime-${difficulty}`) || null;

if (bestTime) {
    bestTimeDisplay.textContent = formatTime(parseInt(bestTime));
}

if (difficulty === 'easy') {
    fieldNumber = 3;
} else if (difficulty === 'mid') {
    fieldNumber = 10;
} else if (difficulty === 'hard') {
    fieldNumber = 20;
}

for (let i = 1; i <= fieldNumber; i++) {
    const createLabel = document.createElement('label');
    createLabel.innerHTML = i;
    const createH3 = document.createElement('h3');
    createH3.id = `h3-${i}`;
    h3Container.appendChild(createLabel);
    h3Container.appendChild(createH3);
}

let h3Elements = document.querySelectorAll('h3');
let currentRandomNum = null;
let min = 1;
let max = 1000;
let usedNumbers = [];

randomDiv.addEventListener("click", () => {
    if (!startTime) {
        startTime = Date.now();
        startTimer();
    }

    if (randomDiv.classList.contains('disabled')) return;
    randomDiv.classList.add('disabled');
    let randomNum;
    do {
        randomNum = Math.floor(Math.random() * (max - min) + min);
    } while (usedNumbers.includes(randomNum));

    currentRandomNum = randomNum;
    randomNF.classList.add('animate');
    randomNF.innerHTML = currentRandomNum;

    setTimeout(() => {
        randomNF.classList.remove('animate');
    }, 500);

    h3Elements.forEach((h3) => {
        if (h3.innerHTML != "") {
            h3.classList.add('disabled');
        }

        h3.onclick = function () {
            if (h3.innerHTML == "" && !usedNumbers.includes(currentRandomNum)) {
                h3.innerHTML = currentRandomNum;
                usedNumbers.push(currentRandomNum);
            } else {
                alert("This number has already been used!");
            }
            randomDiv.classList.remove('disabled');
            console.log(usedNumbers);
            winCondition();
        };
    });
});

function winCondition() {
    let win = true;

    if (usedNumbers.length === fieldNumber) {
        for (let i = 1; i < fieldNumber; i++) {
            const currentH3 = document.getElementById(`h3-${i}`);
            const nextH3 = document.getElementById(`h3-${i + 1}`);
            const currentNum = parseInt(currentH3.innerHTML);
            const nextNum = parseInt(nextH3.innerHTML);

            if (currentNum > nextNum) {
                win = false;
                break;
            }
        }
        stopTimer();
        if (win) {
            console.log("win");
            main.classList.add('hide');
            youWin.classList.add('show');
            saveBestTime();

            h3Elements.forEach((h3) => {
                h3.classList.add('disabled');
            });

            setTimeout(() => {
                main.classList.remove('hide');
                youWin.classList.remove('show');
            }, 2000);
        } else {
            main.classList.add('hide');
            youLost.classList.add('show');
            console.log('lost');

            h3Elements.forEach((h3) => {
                h3.classList.add('disabled');
            });

            setTimeout(() => {
                main.classList.remove('hide');
                youLost.classList.remove('show');
            }, 2000);
        }
        randomDiv.classList.add('disabled');
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

function saveBestTime() {
    const elapsedTime = Date.now() - startTime;
    if (!bestTime || elapsedTime < parseInt(bestTime)) {
        localStorage.setItem(`bestTime-${difficulty}`, elapsedTime);
        bestTimeDisplay.textContent = formatTime(elapsedTime);
    }
}

restartBtn.addEventListener("click", () => {
    location.reload();
});
