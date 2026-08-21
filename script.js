/* ========================================
   SkillCore — Interactive Learning Game
   Mobile First / 3D UI
======================================== */

:root {
    --bg: #080b14;
    --surface: #111625;
    --surface-2: #171d2e;
    --border: #273047;

    --text: #f8fafc;
    --muted: #94a3b8;

    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --cyan: #22d3ee;
    --green: #22c55e;
    --red: #ef4444;
    --yellow: #facc15;

    --radius: 18px;
    --transition: 180ms ease;
}


/* ========================================
   RESET
======================================== */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
}

body {
    min-height: 100vh;

    background:
        radial-gradient(
            circle at 20% 10%,
            rgba(99, 102, 241, 0.18),
            transparent 35%
        ),
        radial-gradient(
            circle at 80% 90%,
            rgba(34, 211, 238, 0.10),
            transparent 35%
        ),
        var(--bg);

    color: var(--text);

    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    line-height: 1.5;
}

button,
input,
select {
    font: inherit;
}

button {
    border: 0;
    cursor: pointer;
}


/* ========================================
   APP
======================================== */

.app {
    min-height: 100vh;
    padding: 16px;
}


/* ========================================
   HEADER
======================================== */

.header {
    max-width: 1100px;
    margin: 0 auto 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 12px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;

    font-size: 20px;
    font-weight: 800;
}

.logo-icon {
    width: 40px;
    height: 40px;

    display: grid;
    place-items: center;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            var(--primary),
            var(--cyan)
        );

    color: white;

    box-shadow:
        0 8px 25px
        rgba(99, 102, 241, 0.35);

    transform: perspective(500px) rotateX(8deg);
}


/* ========================================
   PLAYER
======================================== */

.player-card {
    max-width: 1100px;
    margin: 0 auto 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 14px;

    padding: 16px;

    border: 1px solid var(--border);
    border-radius: var(--radius);

    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,0.06),
            rgba(255,255,255,0.02)
        );

    box-shadow:
        0 20px 50px
        rgba(0,0,0,0.25);

    backdrop-filter: blur(12px);
}

.player-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 46px;
    height: 46px;

    display: grid;
    place-items: center;

    border-radius: 50%;

    background: var(--primary);

    font-weight: 800;
}

.player-name {
    font-size: 14px;
    font-weight: 700;
}

.player-level {
    color: var(--muted);
    font-size: 12px;
}


/* ========================================
   XP BAR
======================================== */

.xp-container {
    flex: 1;
    max-width: 300px;
}

.xp-label {
    display: flex;
    justify-content: space-between;

    margin-bottom: 6px;

    color: var(--muted);
    font-size: 11px;
}

.xp-bar {
    height: 8px;

    overflow: hidden;

    border-radius: 999px;

    background: #20283b;
}

.xp-progress {
    height: 100%;

    width: 65%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            var(--primary),
            var(--cyan)
        );

    box-shadow:
        0 0 14px
        rgba(34,211,238,0.45);

    transition:
        width 500ms ease;
}


/* ========================================
   GAME AREA
======================================== */

.game-container {
    max-width: 1100px;
    margin: 0 auto;
}

.game-header {
    margin-bottom: 20px;
}

.game-header h1 {
    margin-bottom: 6px;

    font-size: clamp(26px, 6vw, 42px);

    line-height: 1.1;

    letter-spacing: -0.04em;
}

.game-header p {
    color: var(--muted);
    font-size: 14px;
}


/* ========================================
   SKILL CARDS
======================================== */

.skills-grid {
    display: grid;

    grid-template-columns: 1fr;

    gap: 14px;
}

.skill-card {
    position: relative;

    min-height: 190px;

    padding: 20px;

    overflow: hidden;

    border: 1px solid var(--border);
    border-radius: 22px;

    background:
        linear-gradient(
            145deg,
            var(--surface-2),
            var(--surface)
        );

    box-shadow:
        0 15px 35px
        rgba(0,0,0,0.25);

    transform-style: preserve-3d;

    transition:
        transform 250ms ease,
        border-color 250ms ease,
        box-shadow 250ms ease;
}

.skill-card::before {
    content: "";

    position: absolute;

    width: 180px;
    height: 180px;

    top: -80px;
    right: -60px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(99,102,241,0.25),
            transparent 70%
        );

    pointer-events: none;
}

.skill-card:hover {
    transform:
        perspective(700px)
        rotateX(3deg)
        rotateY(-3deg)
        translateY(-4px);

    border-color:
        rgba(99,102,241,0.7);

    box-shadow:
        0 25px 50px
        rgba(0,0,0,0.35);
}

.skill-icon {
    width: 52px;
    height: 52px;

    display: grid;
    place-items: center;

    margin-bottom: 18px;

    border-radius: 15px;

    background:
        linear-gradient(
            135deg,
            var(--primary),
            var(--cyan)
        );

    font-size: 22px;

    transform:
        translateZ(25px);

    box-shadow:
        0 10px 25px
        rgba(99,102,241,0.3);
}

.skill-card h2 {
    margin-bottom: 5px;

    font-size: 18px;

    transform:
        translateZ(18px);
}

.skill-card p {
    color: var(--muted);

    font-size: 13px;

    transform:
        translateZ(12px);
}


/* ========================================
   GAME BUTTON
======================================== */

.play-button {
    width: 100%;

    min-height: 46px;

    margin-top: 18px;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
        );

    color: white;

    font-size: 13px;
    font-weight: 800;

    box-shadow:
        0 8px 20px
        rgba(79,70,229,0.3);

    transition:
        transform var(--transition),
        box-shadow var(--transition);
}

.play-button:hover {
    transform: translateY(-2px);

    box-shadow:
        0 12px 28px
        rgba(79,70,229,0.45);
}

.play-button:active {
    transform:
        translateY(1px)
        scale(0.98);
}


/* ========================================
   QUIZ PANEL
======================================== */

.quiz-panel {
    margin-top: 22px;

    padding: 20px;

    border: 1px solid var(--border);

    border-radius: 22px;

    background: var(--surface);

    box-shadow:
        0 20px 50px
        rgba(0,0,0,0.3);
}

.quiz-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 20px;
}

.quiz-progress {
    color: var(--muted);

    font-size: 12px;
}

.quiz-score {
    color: var(--cyan);

    font-size: 13px;
    font-weight: 800;
}

.question {
    margin-bottom: 20px;

    font-size: 20px;
    font-weight: 800;

    line-height: 1.35;
}


/* ========================================
   ANSWERS
======================================== */

.answers {
    display: grid;

    gap: 10px;
}

.answer-button {
    width: 100%;

    padding: 14px;

    border: 1px solid var(--border);

    border-radius: 12px;

    background: var(--surface-2);

    color: var(--text);

    text-align: left;

    transition:
        background var(--transition),
        border-color var(--transition),
        transform var(--transition);
}

.answer-button:hover {
    background: #20283b;

    border-color: var(--primary);

    transform: translateX(3px);
}

.answer-button.correct {
    border-color: var(--green);

    background:
        rgba(34,197,94,0.12);

    color: #86efac;
}

.answer-button.wrong {
    border-color: var(--red);

    background:
        rgba(239,68,68,0.12);

    color: #fca5a5;
}


/* ========================================
   RESULT
======================================== */

.result-panel {
    text-align: center;

    padding: 30px 20px;
}

.result-icon {
    width: 70px;
    height: 70px;

    display: grid;
    place-items: center;

    margin: 0 auto 16px;

    border-radius: 50%;

    background:
        linear-gradient(
            135deg,
            var(--primary),
            var(--cyan)
        );

    font-size: 30px;

    box-shadow:
        0 15px 35px
        rgba(99,102,241,0.35);
}

.result-panel h2 {
    margin-bottom: 6px;

    font-size: 26px;
}

.result-panel p {
    color: var(--muted);

    font-size: 14px;
}


/* ========================================
   STREAK
======================================== */

.streak-card {
    margin-top: 20px;

    padding: 18px;

    border: 1px solid var(--border);

    border-radius: var(--radius);

    background:
        linear-gradient(
            135deg,
            rgba(250,204,21,0.08),
            var(--surface)
        );

    text-align: center;
}

.streak-number {
    display: block;

    margin-bottom: 4px;

    color: var(--yellow);

    font-size: 30px;
    font-weight: 900;
}

.streak-label {
    color: var(--muted);

    font-size: 12px;
}


/* ========================================
   HIDDEN
======================================== */

.hidden {
    display: none !important;
}


/* ========================================
   ANIMATIONS
======================================== */

@keyframes fadeUp {
    from {
        opacity: 0;
        transform:
            translateY(15px);
    }

    to {
        opacity: 1;
        transform:
            translateY(0);
    }
}

@keyframes pop {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.skill-card {
    animation:
        fadeUp 450ms ease both;
}

.quiz-panel {
    animation:
        pop 250ms ease both;
}


/* ========================================
   TABLET
======================================== */

@media (min-width: 600px) {

    .app {
        padding: 24px;
    }

    .skills-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }

    .answers {
        grid-template-columns:
            repeat(2, 1fr);
    }
}


/* ========================================
   DESKTOP
======================================== */

@media (min-width: 900px) {

    .app {
        padding: 32px;
    }

    .skills-grid {
        grid-template-columns:
            repeat(3, 1fr);
    }

    .skill-card {
        min-height: 220px;
    }

    .quiz-panel {
        padding: 30px;
    }
}


/* ========================================
   REDUCED MOTION
======================================== */

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation: none !important;

        transition: none !important;

        scroll-behavior: auto !important;
    }

    .skill-card:hover {
        transform: none;
    }
}
