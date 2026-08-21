"use strict";

/* ========================================
   DrawFlow
   Interactive Drawing Application
======================================== */


/* ========================================
   DOM
======================================== */

const canvas =
    document.querySelector("#drawingCanvas");

const ctx =
    canvas.getContext("2d");

const colorPicker =
    document.querySelector("#colorPicker");

const brushSize =
    document.querySelector("#brushSize");

const sizeValue =
    document.querySelector("#sizeValue");

const toolButtons =
    document.querySelectorAll(".tool-button[data-tool]");

const undoButton =
    document.querySelector("#undoButton");

const redoButton =
    document.querySelector("#redoButton");

const clearButton =
    document.querySelector("#clearButton");

const saveButton =
    document.querySelector("#saveButton");

const downloadButton =
    document.querySelector("#downloadButton");

const soundButton =
    document.querySelector("#soundButton");

const themeButton =
    document.querySelector("#themeButton");

const toast =
    document.querySelector("#toast");

const saveStatus =
    document.querySelector("#saveStatus");


/* ========================================
   STATE
======================================== */

let currentTool = "brush";

let isDrawing = false;

let lastX = 0;

let lastY = 0;

let soundEnabled =
    localStorage.getItem("drawflow-sound") !== "off";

let isLight =
    localStorage.getItem("drawflow-theme") === "light";


let history = [];

let historyIndex = -1;

let saveTimer = null;


/* ========================================
   AUDIO
======================================== */

let audioContext = null;


function getAudioContext() {

    if (!audioContext) {

        const Audio =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!Audio) {
            return null;
        }

        audioContext =
            new Audio();
    }

    return audioContext;
}


function playSound(type) {

    if (!soundEnabled) {
        return;
    }


    try {

        const audio =
            getAudioContext();

        if (!audio) {
            return;
        }


        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();


        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );


        const now =
            audio.currentTime;


        let startFrequency = 400;

        let endFrequency = 600;


        if (type === "success") {

            startFrequency = 520;

            endFrequency = 850;

        } else if (type === "delete") {

            startFrequency = 300;

            endFrequency = 120;

        } else if (type === "undo") {

            startFrequency = 500;

            endFrequency = 350;

        } else if (type === "tool") {

            startFrequency = 450;

            endFrequency = 650;
        }


        oscillator.frequency.setValueAtTime(
            startFrequency,
            now
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            endFrequency,
            now + 0.12
        );


        gain.gain.setValueAtTime(
            0.0001,
            now
        );


        gain.gain.exponentialRampToValueAtTime(
            0.08,
            now + 0.01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.14
        );


        oscillator.start(now);

        oscillator.stop(
            now + 0.14
        );

    } catch (error) {

        console.warn(
            "Audio unavailable:",
            error
        );
    }
}


/* ========================================
   TOAST
======================================== */

let toastTimer;


function showToast(message) {

    clearTimeout(
        toastTimer
    );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);
}


/* ========================================
   STATUS
======================================== */

function setStatus(message) {

    if (!saveStatus) {
        return;
    }


    saveStatus.textContent =
        `● ${message}`;
}


/* ========================================
   CANVAS SIZE
======================================== */

function resizeCanvas() {

    const wrapper =
        canvas.parentElement;


    const rect =
        wrapper.getBoundingClientRect();


    if (
        rect.width <= 0 ||
        rect.height <= 0
    ) {
        return;
    }


    const oldImage =
        canvas.width > 0 &&
        canvas.height > 0
            ? canvas.toDataURL()
            : null;


    const devicePixelRatio =
        Math.max(
            1,
            window.devicePixelRatio || 1
        );


    canvas.width =
        Math.floor(
            rect.width *
            devicePixelRatio
        );


    canvas.height =
        Math.floor(
            rect.height *
            devicePixelRatio
        );


    ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );


    ctx.lineCap =
        "round";

    ctx.lineJoin =
        "round";


    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );


    if (oldImage) {

        const image =
            new Image();


        image.onload = () => {

            ctx.drawImage(
                image,
                0,
                0,
                rect.width,
                rect.height
            );
        };


        image.src =
            oldImage;
    }
}


/* ========================================
   CANVAS POSITION
======================================== */

function getPointerPosition(event) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            event.clientX -
            rect.left,

        y:
            event.clientY -
            rect.top
    };
}


/* ========================================
   DRAW SETTINGS
======================================== */

function configureBrush() {

    ctx.lineWidth =
        Number(
            brushSize.value
        );


    if (currentTool === "eraser") {

        ctx.globalCompositeOperation =
            "destination-out";

    } else {

        ctx.globalCompositeOperation =
            "source-over";

        ctx.strokeStyle =
            colorPicker.value;
    }
}


/* ========================================
   START DRAWING
======================================== */

function startDrawing(event) {

    event.preventDefault();


    isDrawing = true;


    const position =
        getPointerPosition(event);


    lastX =
        position.x;

    lastY =
        position.y;


    configureBrush();


    ctx.beginPath();

    ctx.moveTo(
        lastX,
        lastY
    );


    try {

        canvas.setPointerCapture(
            event.pointerId
        );

    } catch {
        // Pointer capture not supported.
    }
}


/* ========================================
   DRAW
======================================== */

function draw(event) {

    if (!isDrawing) {
        return;
    }


    event.preventDefault();


    const position =
        getPointerPosition(event);


    configureBrush();


    ctx.beginPath();


    ctx.moveTo(
        lastX,
        lastY
    );


    ctx.lineTo(
        position.x,
        position.y
    );


    ctx.stroke();


    lastX =
        position.x;

    lastY =
        position.y;
}


/* ========================================
   STOP DRAWING
======================================== */

function stopDrawing(event) {

    if (!isDrawing) {
        return;
    }


    isDrawing = false;


    ctx.closePath();


    try {

        canvas.releasePointerCapture(
            event.pointerId
        );

    } catch {
        // Pointer capture unavailable.
    }


    saveCanvasState();

    scheduleAutoSave();
}


/* ========================================
   TOOL
======================================== */

function setTool(tool) {

    currentTool =
        tool;


    toolButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.tool === tool
            );
        }
    );


    canvas.style.cursor =
        tool === "eraser"
            ? "cell"
            : "crosshair";


    playSound("tool");

    showToast(
        tool === "eraser"
            ? "Eraser selected."
            : "Brush selected."
    );
}


/* ========================================
   HISTORY
======================================== */

function getCanvasData() {

    return canvas.toDataURL(
        "image/png"
    );
}


function saveCanvasState() {

    const state =
        getCanvasData();


    if (
        historyIndex >= 0 &&
        history[historyIndex] === state
    ) {
        return;
    }


    history =
        history.slice(
            0,
            historyIndex + 1
        );


    history.push(
        state
    );


    if (history.length > 30) {

        history.shift();
    }


    historyIndex =
        history.length - 1;


    updateHistoryButtons();
}


function restoreCanvasState(state) {

    const image =
        new Image();


    image.onload = () => {

        const rect =
            canvas.getBoundingClientRect();


        ctx.save();


        ctx.setTransform(
            1,
            0,
            0,
            1,
            0,
            0
        );


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        const dpr =
            Math.max(
                1,
                window.devicePixelRatio || 1
            );


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        ctx.globalCompositeOperation =
            "source-over";


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            0,
            0,
            rect.width,
            rect.height
        );


        ctx.drawImage(
            image,
            0,
            0,
            rect.width,
            rect.height
        );


        ctx.restore();


        scheduleAutoSave();
    };


    image.src =
        state;
}


function undo() {

    if (historyIndex <= 0) {

        showToast(
            "Nothing to undo."
        );

        return;
    }


    historyIndex--;

    restoreCanvasState(
        history[historyIndex]
    );


    updateHistoryButtons();

    playSound("undo");

    showToast(
        "Undo."
    );
}


function redo() {

    if (
        historyIndex >=
        history.length - 1
    ) {

        showToast(
            "Nothing to redo."
        );

        return;
    }


    historyIndex++;

    restoreCanvasState(
        history[historyIndex]
    );


    updateHistoryButtons();

    playSound("tool");

    showToast(
        "Redo."
    );
}


function updateHistoryButtons() {

    undoButton.disabled =
        historyIndex <= 0;


    redoButton.disabled =
        historyIndex >=
        history.length - 1;


    undoButton.style.opacity =
        undoButton.disabled
            ? "0.45"
            : "1";


    redoButton.style.opacity =
        redoButton.disabled
            ? "0.45"
            : "1";
}


/* ========================================
   CLEAR
======================================== */

function clearCanvas() {

    const confirmed =
        window.confirm(
            "Clear the entire drawing?"
        );


    if (!confirmed) {
        return;
    }


    const rect =
        canvas.getBoundingClientRect();


    ctx.save();


    ctx.globalCompositeOperation =
        "source-over";


    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(
        0,
        0,
        rect.width,
        rect.height
    );


    ctx.restore();


    saveCanvasState();

    scheduleAutoSave();

    playSound("delete");

    showToast(
        "Canvas cleared."
    );
}


/* ========================================
   LOCAL STORAGE
======================================== */

function saveDrawing() {

    try {

        localStorage.setItem(
            "drawflow-drawing",
            getCanvasData()
        );


        setStatus(
            "Saved"
        );


        showToast(
            "Drawing saved."
        );


        playSound(
            "success"
        );

    } catch (error) {

        console.error(
            "Could not save drawing:",
            error
        );


        showToast(
            "Could not save drawing."
        );
    }
}


function scheduleAutoSave() {

    clearTimeout(
        saveTimer
    );


    setStatus(
        "Saving..."
    );


    saveTimer =
        setTimeout(
            saveDrawingSilently,
            500
        );
}


function saveDrawingSilently() {

    try {

        localStorage.setItem(
            "drawflow-drawing",
            getCanvasData()
        );


        setStatus(
            "Saved"
        );

    } catch {

        setStatus(
            "Save failed"
        );
    }
}


function loadDrawing() {

    const saved =
        localStorage.getItem(
            "drawflow-drawing"
        );


    if (!saved) {
        return false;
    }


    restoreCanvasState(
        saved
    );


    return true;
}


/* ========================================
   DOWNLOAD
======================================== */

function downloadPNG() {

    const link =
        document.createElement("a");


    link.download =
        `drawflow-${Date.now()}.png`;


    link.href =
        canvas.toDataURL(
            "image/png"
        );


    link.click();


    playSound(
        "success"
    );


    showToast(
        "PNG downloaded."
    );
}


/* ========================================
   THEME
======================================== */

function loadTheme() {

    if (isLight) {

        document.body.classList.add(
            "light"
        );


        themeButton.textContent =
            "☀️";

    } else {

        themeButton.textContent =
            "🌙";
    }
}


function toggleTheme() {

    isLight =
        document.body.classList.toggle(
            "light"
        );


    localStorage.setItem(
        "drawflow-theme",
        isLight
            ? "light"
            : "dark"
    );


    themeButton.textContent =
        isLight
            ? "☀️"
            : "🌙";


    playSound(
        "tool"
    );
}


/* ========================================
   SOUND
======================================== */

function loadSoundState() {

    soundButton.textContent =
        soundEnabled
            ? "🔊"
            : "🔇";
}


function toggleSound() {

    soundEnabled =
        !soundEnabled;


    localStorage.setItem(
        "drawflow-sound",
        soundEnabled
            ? "on"
            : "off"
    );


    soundButton.textContent =
        soundEnabled
            ? "🔊"
            : "🔇";


    if (soundEnabled) {

        playSound(
            "success"
        );

        showToast(
            "Sound enabled."
        );

    } else {

        showToast(
            "Sound disabled."
        );
    }
}


/* ========================================
   EVENTS
======================================== */

canvas.addEventListener(
    "pointerdown",
    startDrawing
);


canvas.addEventListener(
    "pointermove",
    draw
);


canvas.addEventListener(
    "pointerup",
    stopDrawing
);


canvas.addEventListener(
    "pointercancel",
    stopDrawing
);


canvas.addEventListener(
    "pointerleave",
    event => {

        if (isDrawing) {
            stopDrawing(event);
        }
    }
);


toolButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                setTool(
                    button.dataset.tool
                );
            }
        );
    }
);


colorPicker.addEventListener(
    "input",
    () => {

        if (
            currentTool ===
            "eraser"
        ) {
            setTool("brush");
        }
    }
);


brushSize.addEventListener(
    "input",
    () => {

        sizeValue.textContent =
            brushSize.value;
    }
);


undoButton.addEventListener(
    "click",
    undo
);


redoButton.addEventListener(
    "click",
    redo
);


clearButton.addEventListener(
    "click",
    clearCanvas
);


saveButton.addEventListener(
    "click",
    saveDrawing
);


downloadButton.addEventListener(
    "click",
    downloadPNG
);


soundButton.addEventListener(
    "click",
    toggleSound
);


themeButton.addEventListener(
    "click",
    toggleTheme
);


/* ========================================
   KEYBOARD SHORTCUTS
======================================== */

document.addEventListener(
    "keydown",
    event => {

        const modifier =
            event.ctrlKey ||
            event.metaKey;


        if (!modifier) {
            return;
        }


        if (
            event.key.toLowerCase() ===
            "z"
        ) {

            event.preventDefault();

            if (event.shiftKey) {

                redo();

            } else {

                undo();
            }
        }


        if (
            event.key.toLowerCase() ===
            "y"
        ) {

            event.preventDefault();

            redo();
        }
    }
);


/* ========================================
   RESIZE
======================================== */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    const saved =
                        getCanvasData();


                    resizeCanvas();


                    restoreCanvasState(
                        saved
                    );

                },
                150
            );
    }
);


/* ========================================
   INIT
======================================== */

function init() {

    loadTheme();

    loadSoundState();


    resizeCanvas();


    const hasDrawing =
        loadDrawing();


    if (!hasDrawing) {

        saveCanvasState();

        saveDrawingSilently();
    }


    updateHistoryButtons();


    sizeValue.textContent =
        brushSize.value;


    setStatus(
        "Ready"
    );
}


document.addEventListener(
    "DOMContentLoaded",
    init
);
