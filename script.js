/* ========================================
   SkillCore — Interactive Learning Game
   JavaScript
======================================== */

"use strict";

/* ========================================
   DATA
======================================== */

const questions = {
    javascript: [
        {
            question: "Which keyword declares a variable that cannot be reassigned?",
            answers: ["let", "var", "const", "static"],
            correct: 2
        },
        {
            question: "Which method converts JSON text into a JavaScript object?",
            answers: [
                "JSON.parse()",
                "JSON.stringify()",
                "JSON.convert()",
                "JSON.object()"
            ],
            correct: 0
        },
        {
            question: "Which symbol is used for strict equality?",
            answers: ["=", "==", "===", "!="],
            correct: 2
        }
    ],

    html: [
        {
            question: "Which HTML element creates a hyperlink?",
            answers: ["<link>", "<a>", "<href>", "<url>"],
            correct: 1
        },
        {
            question: "Which element is used for the largest heading?",
            answers: ["<heading>", "<h6>", "<head>", "<h1>"],
            correct: 3
        }
    ],

    css: [
        {
            question: "Which property changes text color?",
            answers: ["font-color", "text-color", "color", "foreground"],
            correct: 2
        },
        {
            question: "Which CSS property creates rounded corners?",
            answers: [
                "corner-radius",
                "border-radius",
                "radius",
                "round-border"
            ],
            correct: 1
        }
    ],

    python: [
        {
            question: "Which keyword defines a function in Python?",
            answers: ["function", "func", "def", "define"],
            correct: 2
        },
        {
            question: "Which symbol starts a comment in Python?",
            answers: ["//", "<!--", "#", "/*"],
            correct: 2
        }
    ]
};


/* ========================================
   GAME STATE
======================================== */

let currentSkill = null;
let currentQuestion = 0;
let score = 0;
let xp = Number(localStorage.getItem("skillcore-xp")) || 0;
let level = Number(localStorage.getItem("skillcore-level")) || 1;
let streak = Number(localStorage.getItem("skillcore-streak")) || 0;

let answered = false;


/* ========================================
   DOM
======================================== */

const quizPanel =
    document.querySelector(".quiz-panel");

const resultPanel =
    document.querySelector(".result-panel");

const questionElement =
    document.querySelector(".question");

const answersElement =
    document.querySelector(".answers");

const quizProgress =
    document.querySelector(".quiz-progress");

const quizScore =
    document.querySelector(".quiz-score");

const xpProgress =
    document.querySelector(".xp-progress");

const playerLevel =
    document.querySelector(".player-level");

const streakNumber =
    document.querySelector(".streak-number");


/* ========================================
   OPTIONAL ELEMENTS
======================================== */

const resultTitle =
    document.querySelector(".result-panel h2");

const resultText =
    document.querySelector(".result-panel p");

const resultIcon =
    document.querySelector(".result-icon");


/* ========================================
   AUDIO
======================================== */

let audioContext = null;


function getAudioContext() {

    if (!audioContext) {
        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    return audioContext;
}


function playSound(type) {

    try {

        const context =
            getAudioContext();

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        oscillator.connect(gain);
        gain.connect(context.destination);

        const now =
            context.currentTime;


        if (type === "correct") {

            oscillator.frequency.setValueAtTime(
                520,
                now
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                850,
                now + 0.15
            );

        } else if (type === "wrong") {

            oscillator.frequency.setValueAtTime(
                260,
                now
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                130,
                now + 0.18
            );

        } else {

            oscillator.frequency.setValueAtTime(
                400,
                now
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                650,
                now + 0.12
            );
        }


        gain.gain.setValueAtTime(
            0.0001,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.12,
            now + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.2
        );


        oscillator.start(now);
        oscillator.stop(now + 0.2);

    } catch (error) {

        console.log(
            "Audio unavailable:",
            error
        );
    }
}


/* ========================================
   SAVE
======================================== */

function saveProgress() {

    localStorage.setItem(
        "skillcore-xp",
        xp
    );

    localStorage.setItem(
        "skillcore-level",
        level
    );

    localStorage.setItem(
        "skillcore-streak",
        streak
    );
}


/* ========================================
   UPDATE PLAYER
======================================== */

function updatePlayer() {

    if (playerLevel) {

        playerLevel.textContent =
            `Level ${level}`;
    }


    if (streakNumber) {

        streakNumber.textContent =
            streak;
    }


    if (xpProgress) {

        const xpInsideLevel =
            xp % 100;

        xpProgress.style.width =
            `${xpInsideLevel}%`;
    }
}


/* ========================================
   ADD XP
======================================== */

function addXP(amount) {

    xp += amount;


    while (xp >= level * 100) {

        xp -= level * 100;

        level++;

        showLevelUp();

        playSound("level");
    }


    saveProgress();

    updatePlayer();
}


/* ========================================
   LEVEL UP
======================================== */

function showLevelUp() {

    document.body.classList.add(
        "level-up"
    );


    setTimeout(() => {

        document.body.classList.remove(
            "level-up"
        );

    }, 700);
}


/* ========================================
   START GAME
======================================== */

function startGame(skill) {

    if (!questions[skill]) {
        console.error(
            `Skill "${skill}" does not exist.`
        );

        return;
    }


    currentSkill = skill;

    currentQuestion = 0;

    score = 0;

    answered = false;


    if (quizPanel) {

        quizPanel.classList.remove(
            "hidden"
        );

        quizPanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    if (resultPanel) {

        resultPanel.classList.add(
            "hidden"
        );
    }


    playSound("start");

    renderQuestion();
}


/* ========================================
   RENDER QUESTION
======================================== */

function renderQuestion() {

    const quiz =
        questions[currentSkill];


    const question =
        quiz[currentQuestion];


    if (!question) {

        finishGame();

        return;
    }


    answered = false;


    if (questionElement) {

        questionElement.textContent =
            question.question;
    }


    if (quizProgress) {

        quizProgress.textContent =
            `${currentQuestion + 1} / ${quiz.length}`;
    }


    if (quizScore) {

        quizScore.textContent =
            `Score: ${score}`;
    }


    if (!answersElement) {
        return;
    }


    answersElement.innerHTML = "";


    question.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "answer-button";

            button.textContent =
                answer;


            button.addEventListener(
                "click",
                () => checkAnswer(
                    index,
                    button
                )
            );


            answersElement.appendChild(
                button
            );
        }
    );


    animateQuestion();
}


/* ========================================
   CHECK ANSWER
======================================== */

function checkAnswer(
    selectedIndex,
    selectedButton
) {

    if (answered) {
        return;
    }


    answered = true;


    const question =
        questions[currentSkill][currentQuestion];


    const buttons =
        answersElement.querySelectorAll(
            ".answer-button"
        );


    buttons.forEach(
        button => {
            button.disabled = true;
        }
    );


    if (
        selectedIndex ===
        question.correct
    ) {

        selectedButton.classList.add(
            "correct"
        );


        score++;

        streak++;

        addXP(25);

        playSound("correct");


        createParticles(
            selectedButton
        );

    } else {

        selectedButton.classList.add(
            "wrong"
        );


        buttons[
            question.correct
        ].classList.add(
            "correct"
        );


        streak = 0;

        playSound("wrong");

        saveProgress();

        updatePlayer();
    }


    if (quizScore) {

        quizScore.textContent =
            `Score: ${score}`;
    }


    setTimeout(() => {

        currentQuestion++;

        renderQuestion();

    }, 850);
}


/* ========================================
   FINISH GAME
======================================== */

function finishGame() {

    if (quizPanel) {

        quizPanel.classList.add(
            "hidden"
        );
    }


    if (resultPanel) {

        resultPanel.classList.remove(
            "hidden"
        );

        resultPanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    const total =
        questions[currentSkill].length;


    const percentage =
        Math.round(
            (score / total) * 100
        );


    if (resultTitle) {

        resultTitle.textContent =
            percentage >= 70
                ? "Excellent! 🎉"
                : "Good Work! 💪";
    }


    if (resultText) {

        resultText.textContent =
            `You scored ${score}/${total} (${percentage}%).`;
    }


    if (resultIcon) {

        resultIcon.textContent =
            percentage >= 70
                ? "🏆"
                : "⭐";
    }


    playSound(
        percentage >= 70
            ? "correct"
            : "start"
    );


    createConfetti();
}


/* ========================================
   RESTART
======================================== */

function restartGame() {

    if (!currentSkill) {
        return;
    }


    startGame(
        currentSkill
    );
}


/* ========================================
   QUESTION ANIMATION
======================================== */

function animateQuestion() {

    if (!quizPanel) {
        return;
    }


    quizPanel.animate(
        [
            {
                opacity: 0,
                transform:
                    "translateY(18px) scale(.98)"
            },
            {
                opacity: 1,
                transform:
                    "translateY(0) scale(1)"
            }
        ],
        {
            duration: 350,
            easing: "cubic-bezier(.2,.8,.2,1)"
        }
    );
}


/* ========================================
   3D CARD EFFECT
======================================== */

function setup3DCards() {

    const cards =
        document.querySelectorAll(
            ".skill-card"
        );


    cards.forEach(card => {

        card.addEventListener(
            "pointermove",
            event => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }


                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateY =
                    ((x - centerX) /
                        centerX) * 5;


                const rotateX =
                    ((centerY - y) /
                        centerY) * 5;


                card.style.transform =
                    `
                    perspective(700px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-4px)
                    `;
            }
        );


        card.addEventListener(
            "pointerleave",
            () => {

                card.style.transform = "";
            }
        );
    });
}


/* ========================================
   PARTICLES
======================================== */

function createParticles(element) {

    const rect =
        element.getBoundingClientRect();


    for (let i = 0; i < 8; i++) {

        const particle =
            document.createElement("span");

        particle.textContent = "+25 XP";

        particle.style.position =
            "fixed";

        particle.style.left =
            `${rect.left + rect.width / 2}px`;

        particle.style.top =
            `${rect.top}px`;

        particle.style.pointerEvents =
            "none";

        particle.style.zIndex =
            "9999";

        particle.style.color =
            "#22d3ee";

        particle.style.fontWeight =
            "800";

        document.body.appendChild(
            particle
        );


        const x =
            (Math.random() - 0.5) * 100;


        particle.animate(
            [
                {
                    opacity: 1,
                    transform:
                        "translate(-50%, 0) scale(1)"
                },
                {
                    opacity: 0,
                    transform:
                        `translate(calc(-50% + ${x}px), -70px) scale(1.2)`
                }
            ],
            {
                duration: 700,
                easing: "ease-out"
            }
        );


        setTimeout(() => {

            particle.remove();

        }, 700);
    }
}


/* ========================================
   CONFETTI
======================================== */

function createConfetti() {

    for (let i = 0; i < 25; i++) {

        const piece =
            document.createElement("span");

        piece.textContent = "✦";

        piece.style.position =
            "fixed";

        piece.style.left =
            `${Math.random() * 100}%`;

        piece.style.top =
            "-20px";

        piece.style.zIndex =
            "9999";

        piece.style.pointerEvents =
            "none";

        piece.style.color =
            [
                "#6366f1",
                "#22d3ee",
                "#22c55e",
                "#facc15"
            ][
                Math.floor(
                    Math.random() * 4
                )
            ];


        document.body.appendChild(
            piece
        );


        piece.animate(
            [
                {
                    transform:
                        "translateY(0) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform:
                        `translateY(100vh) rotate(720deg)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    1200 +
                    Math.random() * 1000,

                easing: "ease-in"
            }
        );


        setTimeout(() => {

            piece.remove();

        }, 2300);
    }
}


/* ========================================
   BUTTONS
======================================== */

function setupButtons() {

    const playButtons =
        document.querySelectorAll(
            ".play-button"
        );


    playButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const skill =
                    button.dataset.skill ||
                    button.closest(
                        ".skill-card"
                    )?.dataset.skill;


                if (skill) {

                    startGame(skill);

                } else {

                    console.warn(
                        "Missing data-skill on play button."
                    );
                }
            }
        );
    });


    const restartButtons =
        document.querySelectorAll(
            "[data-restart]"
        );


    restartButtons.forEach(button => {

        button.addEventListener(
            "click",
            restartGame
        );
    });


    const resetButtons =
        document.querySelectorAll(
            "[data-reset]"
        );


    resetButtons.forEach(button => {

        button.addEventListener(
            "click",
            resetProgress
        );
    });
}


/* ========================================
   RESET PROGRESS
======================================== */

function resetProgress() {

    const confirmed =
        window.confirm(
            "Reset all SkillCore progress?"
        );


    if (!confirmed) {
        return;
    }


    xp = 0;

    level = 1;

    streak = 0;

    score = 0;

    saveProgress();

    updatePlayer();

    playSound("start");
}


/* ========================================
   KEYBOARD
======================================== */

document.addEventListener(
    "keydown",
    event => {

        if (!currentSkill) {
            return;
        }


        const number =
            Number(event.key);


        if (
            number >= 1 &&
            number <= 4
        ) {

            const buttons =
                answersElement?.querySelectorAll(
                    ".answer-button"
                );


            if (
                buttons &&
                buttons[number - 1]
            ) {

                buttons[number - 1].click();
            }
        }
    }
);


/* ========================================
   INIT
======================================== */

function init() {

    updatePlayer();

    setupButtons();

    setup3DCards();


    /* Prevent accidental page refresh
       from submitting forms. */

    document.addEventListener(
        "submit",
        event => {
            event.preventDefault();
        }
    );
}


document.addEventListener(
    "DOMContentLoaded",
    init
);
