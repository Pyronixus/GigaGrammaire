// --- VARIABLES D'ÉTAT ---
let phrasesDb = [];
let currentMode = "natures";
let currentQuestion = null;
let currentSentenceText = "";
let score = 0;
let totalQuestions = 0;

const compliments = ["Excellent !", "Parfait ! 🔥", "Tu gères la grammaire !", "Quel talent ! ⚡", "Exactement ça !", "Magnifique ! 🏆"];

// --- ÉLÉMENTS DOM EXISTANTS ---
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const quitBtn = document.getElementById("quit-btn");
const sentenceContainer = document.getElementById("sentence-container");
const natureGroup = document.getElementById("nature-input-group");
const fonctionGroup = document.getElementById("fonction-input-group");
const labelNature = document.getElementById("label-nature");
const labelFonction = document.getElementById("label-fonction");
const inputNature = document.getElementById("input-nature");
const inputFonction = document.getElementById("input-fonction");
const submitBtn = document.getElementById("submit-btn");
const hintBtn = document.getElementById("hint-btn");
const nextBtn = document.getElementById("next-btn");
const hintZone = document.getElementById("hint-zone");
const feedbackZone = document.getElementById("feedback-zone");
const progressTrack = document.getElementById("progress-track");

// --- ÉLÉMENTS DOM DES NOUVEAUX MENUS ---
const mainMenu = document.getElementById("main-menu");
const lessonsMenu = document.getElementById("lessons-menu");
const sheetNatures = document.getElementById("sheet-natures");
const sheetFonctions = document.getElementById("sheet-fonctions");

const toLessonsBtn = document.getElementById("to-lessons-btn");
const toExercisesBtn = document.getElementById("to-exercises-btn");

const backToMainFromLessons = document.getElementById("back-to-main-from-lessons");
const backToMainFromSetup = document.getElementById("back-to-main-from-setup");
const backToLessonsFromNatures = document.getElementById("back-to-lessons-from-natures");
const backToLessonsFromFonctions = document.getElementById("back-to-lessons-from-fonctions");

const lessonNaturesBtn = document.getElementById("lesson-natures-btn");
const lessonFonctionsBtn = document.getElementById("lesson-fonctions-btn");


// --- NAVIGATION DES NOUVEAUX MENUS ---

// Aller vers l'arborescence Cours
toLessonsBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    lessonsMenu.classList.remove("hidden");
});

// Aller vers l'arborescence Exercices (Configuration)
toExercisesBtn.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    setupScreen.classList.remove("hidden");
});

// Retours arrière
backToMainFromLessons.addEventListener("click", () => {
    lessonsMenu.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});

backToMainFromSetup.addEventListener("click", () => {
    setupScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});

backToLessonsFromNatures.addEventListener("click", () => {
    sheetNatures.classList.add("hidden");
    lessonsMenu.classList.remove("hidden");
});

backToLessonsFromFonctions.addEventListener("click", () => {
    sheetFonctions.classList.add("hidden");
    lessonsMenu.classList.remove("hidden");
});

// Affichage des fiches de cours individuelles
lessonNaturesBtn.addEventListener("click", () => {
    lessonsMenu.classList.add("hidden");
    sheetNatures.classList.remove("hidden");
});

lessonFonctionsBtn.addEventListener("click", () => {
    lessonsMenu.classList.add("hidden");
    sheetFonctions.classList.remove("hidden");
});


// --- LOGIQUE ANCIENNE DE L'EXERCICE (INCHANGÉE) ---

startBtn.addEventListener("click", startGame);
quitBtn.addEventListener("click", quitGame);
hintBtn.addEventListener("click", showHint);
submitBtn.addEventListener("click", checkAnswers);
nextBtn.addEventListener("click", loadNewQuestion);

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (!gameScreen.classList.contains("hidden")) {
            if (!nextBtn.classList.contains("hidden")) {
                loadNewQuestion();
            } else if (!submitBtn.classList.contains("hidden")) {
                checkAnswers();
            }
        }
    }
});

async function loadDatabase() {
    try {
        const response = await fetch('sentences.json');
        if (!response.ok) throw new Error("Impossible de charger le fichier JSON");
        phrasesDb = await response.json();
    } catch (error) {
        console.error("Erreur base de données :", error);
    }
}
loadDatabase();

function startGame() {
    if (phrasesDb.length === 0) return;
    
    currentMode = document.querySelector('input[name="mode"]:checked').value;
    score = 0;
    totalQuestions = 0;
    updateScoreDisplay();

    setupScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    loadNewQuestion();
}

function quitGame() {
    gameScreen.classList.add("hidden");
    setupScreen.classList.remove("hidden");
}

function loadNewQuestion() {
    inputNature.value = "";
    inputFonction.value = "";
    hintZone.classList.add("hidden");
    feedbackZone.classList.add("hidden");
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
    hintBtn.classList.remove("hidden");

    let validQuestions = [];

    phrasesDb.forEach(item => {
        item.questions.forEach(q => {
            if (currentMode === "les deux" || q.type === currentMode) {
                validQuestions.push({
                    sentence: item.sentence,
                    questionData: q
                });
            }
        });
    });

    if (validQuestions.length === 0) return;

    const randomPick = validQuestions[Math.floor(Math.random() * validQuestions.length)];
    currentSentenceText = randomPick.sentence;
    currentQuestion = randomPick.questionData;

    if (currentQuestion.type === "nature") {
        natureGroup.classList.remove("hidden");
        fonctionGroup.classList.add("hidden");
        labelNature.innerHTML = `Nature du mot <span class="highlight-nature">"${currentQuestion.target}"</span> :`;
        sentenceContainer.innerHTML = currentSentenceText.replace(currentQuestion.target, `<span class="highlight-nature">${currentQuestion.target}</span>`);
        setTimeout(() => inputNature.focus(), 50);
    } else if (currentQuestion.type === "fonction") {
        natureGroup.classList.add("hidden");
        fonctionGroup.classList.remove("hidden");
        labelFonction.innerHTML = `Fonction du groupe <span class="highlight-fonction">"${currentQuestion.target}"</span> :`;
        sentenceContainer.innerHTML = currentSentenceText.replace(currentQuestion.target, `<span class="highlight-fonction">${currentQuestion.target}</span>`);
        setTimeout(() => inputFonction.focus(), 50);
    }
}

function showHint() {
    hintZone.textContent = currentQuestion.hint;
    hintZone.classList.remove("hidden");
}

function cleanString(str) {
    return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function checkAnswers() {
    let userAnswer = "";
    if (currentQuestion.type === "nature") {
        userAnswer = cleanString(inputNature.value);
    } else {
        userAnswer = cleanString(inputFonction.value);
    }

    if (userAnswer === "") return;

    totalQuestions++;
    let isCorrect = false;
    const expectedAnswer = cleanString(currentQuestion.answer);

    if (userAnswer.includes(expectedAnswer) || expectedAnswer.includes(userAnswer)) {
        isCorrect = true;
    }

    if (isCorrect) {
        score++;
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        feedbackZone.className = "feedback-box correct";
        feedbackZone.innerHTML = `<strong>${randomCompliment}</strong> C'est tout à fait ça !`;
    } else {
        feedbackZone.className = "feedback-box wrong";
        feedbackZone.innerHTML = `<strong>Oups !</strong> La bonne réponse pour <i>"${currentQuestion.target}"</i> était : <strong>${currentQuestion.answer}</strong>.`;
    }

    feedbackZone.classList.remove("hidden");
    submitBtn.classList.add("hidden");
    hintBtn.classList.add("hidden");
    nextBtn.classList.remove("hidden");

    updateScoreDisplay();
}

function updateScoreDisplay() {
    progressTrack.textContent = `Score : ${score}/${totalQuestions}`;
}