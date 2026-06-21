// --- VARIABLES D'ÉTAT ---
let phrasesDb = [];
let currentMode = "natures";
let currentQuestion = null;
let currentSentenceText = "";
let score = 0;
let totalQuestions = 0;
let questionsPool = [];
let poolIndex = 0;

const compliments = [
  "Excellent !",
  "Parfait ! 🔥",
  "Tu gères la grammaire !",
  "Quel talent ! ⚡",
  "Exactement ça !",
  "Magnifique ! 🏆",
  "Sans faute ! Tu as brisé le code de l'erreur ! 💻",
  "Gramm-incroyable ! Tu maîtrises les règles à la perfection ! 📏",
  "Tu as tout faux... de t'inquiéter, c'est un sans-faute ! 🎯",
  "Syntaxe error ? Connais pas. Tu es une machine ! 🤖",
  "Tu tapes dans le mille, c'est carrément 'touche'-ant ! ⌨️",
  "Pas de bug dans ta logique, tu es au sommet ! 🏔️",
  "Tu écris l'histoire (et sans aucune faute) ! 📝",
  "Accords parfaits ! Tu joues une partition sans fausse note ! 🎶",
  "Mots fléchés, mots trouvés... Tu es une vraie flèche ! 🏹",
  "Une performance 'ortho-graphique' de haut vol ! 🦅",
  "Tu as le 'mot' pour rire, mais surtout le mot juste ! 💡",
  "Exceptionnel ! Même les règles de grammaire n'ont pas d'exception face à toi ! 🛡️",
  "Tu es en mode 'compilation' de succès ! 🚀",
  "Zéro faute, 100% de génie : le compte est bon ! 🧠",
];

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
const statsBtn = document.getElementById("stats-btn");
const toStatsBtn = document.getElementById("to-stats-btn");
const progressSummary = document.getElementById("progress-summary");
const statsScreen = document.getElementById("stats-screen");
const backToGameFromStats = document.getElementById("back-to-game-from-stats");
const resetStatsBtn = document.getElementById("reset-stats-btn");
const statsTotalEl = document.getElementById("stats-total");
const statsCorrectEl = document.getElementById("stats-correct");
const statsRateEl = document.getElementById("stats-rate");
const statsChart = document.getElementById("stats-chart");
const statsSubtitle = statsScreen.querySelector(".subtitle-sheet");
const periodButtons = Array.from(document.querySelectorAll(".period-btn"));
const skipBtn = document.getElementById("skip-btn");

const statsKey = "gigagrammaire_progress_stats";
let statsEntries = [];
let sessionStatsEntries = [];
let selectedStatsPeriod = "1y";
let statsOrigin = "global";

// --- ÉLÉMENTS DOM DES NOUVEAUX MENUS ---
const mainMenu = document.getElementById("main-menu");
const lessonsMenu = document.getElementById("lessons-menu");
const sheetNatures = document.getElementById("sheet-natures");
const sheetFonctions = document.getElementById("sheet-fonctions");

const toLessonsBtn = document.getElementById("to-lessons-btn");
const toExercisesBtn = document.getElementById("to-exercises-btn");

const backToMainFromLessons = document.getElementById(
  "back-to-main-from-lessons",
);
const backToMainFromSetup = document.getElementById("back-to-main-from-setup");
const backToLessonsFromNatures = document.getElementById(
  "back-to-lessons-from-natures",
);
const backToLessonsFromFonctions = document.getElementById(
  "back-to-lessons-from-fonctions",
);

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

// --- LOGIQUE DES EXERCICES ---

startBtn.addEventListener("click", startGame);
quitBtn.addEventListener("click", quitGame);
hintBtn.addEventListener("click", showHint);
submitBtn.addEventListener("click", () => checkAnswers(false));
skipBtn.addEventListener("click", () => checkAnswers(true));
nextBtn.addEventListener("click", loadNewQuestion);

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (!gameScreen.classList.contains("hidden")) {
      if (!nextBtn.classList.contains("hidden")) {
        loadNewQuestion();
      } else if (!submitBtn.classList.contains("hidden")) {
        checkAnswers(false);
      }
    }
  }
});

statsBtn.addEventListener("click", () => {
  statsOrigin = "session";
  gameScreen.classList.add("hidden");
  statsScreen.classList.remove("hidden");
  updateStatsPanel();
});

toStatsBtn.addEventListener("click", () => {
  statsOrigin = "global";
  mainMenu.classList.add("hidden");
  statsScreen.classList.remove("hidden");
  updateStatsPanel();
});

backToGameFromStats.addEventListener("click", () => {
  statsScreen.classList.add("hidden");
  if (statsOrigin === "session") {
    gameScreen.classList.remove("hidden");
  } else {
    mainMenu.classList.remove("hidden");
  }
});

resetStatsBtn.addEventListener("click", resetStats);
periodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedStatsPeriod = button.dataset.period;
    periodButtons.forEach((btn) =>
      btn.classList.toggle("active", btn === button),
    );
    updateStatsPanel();
  });
});

window.addEventListener("resize", () => {
  if (!statsScreen.classList.contains("hidden")) {
    drawStatsChart();
  }
});

async function loadDatabase() {
  try {
    const response = await fetch("assets/sentences.json");
    if (!response.ok) throw new Error("Impossible de charger le fichier JSON");
    phrasesDb = await response.json();
  } catch (error) {
    console.error("Erreur base de données :", error);
  }
}
loadDatabase();
loadStats();

function startGame() {
  if (!phrasesDb || phrasesDb.length === 0) {
    alert("La base de données n'est pas chargée.");
    return;
  }

  currentMode = document.querySelector('input[name="mode"]:checked').value;
  score = 0;
  totalQuestions = 0;
  sessionStatsEntries = [];
  updateScoreDisplay();

  // --- CRÉATION ET MÉLANGE DU POOL DE QUESTIONS ---
  questionsPool = [];
  phrasesDb.forEach((sentenceObj) => {
    sentenceObj.questions.forEach((q) => {
      let modeNettoyé = currentMode.trim().toLowerCase();
      let typeNettoyé = q.type.trim().toLowerCase();

      let match = false;
      if (modeNettoyé === "les deux") match = true;
      else if (
        modeNettoyé.startsWith("nature") &&
        typeNettoyé.startsWith("nature")
      )
        match = true;
      else if (
        modeNettoyé.startsWith("fonction") &&
        typeNettoyé.startsWith("fonction")
      )
        match = true;
      else if (typeNettoyé === modeNettoyé) match = true;

      if (match) {
        // On stocke la question ET la phrase parente pour l'affichage
        questionsPool.push({
          sentence: sentenceObj.sentence,
          question: q,
        });
      }
    });
  });

  if (questionsPool.length === 0) {
    alert(
      `Aucune question trouvée pour le mode "${currentMode}". Vérifie ton fichier sentences.json.`,
    );
    return;
  }

  // Algorithme de Fisher-Yates pour mélanger efficacement le pool
  for (let i = questionsPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionsPool[i], questionsPool[j]] = [questionsPool[j], questionsPool[i]];
  }

  poolIndex = 0; // On commence au début du pool mélangé

  setupScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  loadNewQuestion();
}

function quitGame() {
  gameScreen.classList.add("hidden");
  setupScreen.classList.remove("hidden");
}

function loadNewQuestion() {
  // 1. Réinitialisation complète de l'interface graphique et des inputs
  inputNature.value = "";
  inputFonction.value = "";
  hintZone.classList.add("hidden");
  feedbackZone.classList.add("hidden");
  nextBtn.classList.add("hidden");
  submitBtn.classList.remove("hidden");
  hintBtn.classList.remove("hidden");
  skipBtn.classList.remove("hidden"); // On s'assure qu'il n'est pas masqué au départ

  // Sécurité si le pool est vide
  if (!questionsPool || questionsPool.length === 0) return;

  // 2. Si on a fait le tour du pool, on le remélange pour ne pas bloquer le joueur
  if (poolIndex >= questionsPool.length) {
    poolIndex = 0;
    for (let i = questionsPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsPool[i], questionsPool[j]] = [
        questionsPool[j],
        questionsPool[i],
      ];
    }
  }

  // 3. Sélection de la question sans aucun doublon possible
  const currentItem = questionsPool[poolIndex];
  currentSentenceText = currentItem.sentence;
  currentQuestion = currentItem.question;

  // On incrémente l'index pour la prochaine fois
  poolIndex++;

  const isMultiWord = currentQuestion.target.trim().includes(" ");
  let typeQuestion = currentQuestion.type.trim().toLowerCase();

  // 4. Configuration dynamique de l'affichage de l'interface
  if (typeQuestion.startsWith("nature")) {
    natureGroup.classList.remove("hidden");
    fonctionGroup.classList.add("hidden");

    // Modification du texte de la consigne
    labelNature.innerHTML = `Quelle est la <strong class="enhance-word">nature</strong> du ${isMultiWord ? "groupe de mots" : "mot"} <span class="highlight-nature">"${currentQuestion.target}"</span> ?`;

    // On injecte le bouton Passer directement à la suite du texte du label
    labelNature.appendChild(skipBtn);

    sentenceContainer.innerHTML = currentSentenceText.replace(
      currentQuestion.target,
      `<span class="highlight-nature">${currentQuestion.target}</span>`,
    );
    inputNature.value = ""; // Force le clean
    setTimeout(() => inputNature.focus(), 50);
  } else if (typeQuestion.startsWith("fonction")) {
    natureGroup.classList.add("hidden");
    fonctionGroup.classList.remove("hidden");

    // Modification du texte de la consigne
    labelFonction.innerHTML = `Quelle est la <strong class="enhance-word">fonction</strong> du ${isMultiWord ? "groupe de mots" : "mot"} <span class="highlight-fonction">"${currentQuestion.target}"</span> ?`;

    // On injecte le bouton Passer directement à la suite du texte du label
    labelFonction.appendChild(skipBtn);

    sentenceContainer.innerHTML = currentSentenceText.replace(
      currentQuestion.target,
      `<span class="highlight-fonction">${currentQuestion.target}</span>`,
    );
    inputFonction.value = ""; // Force le clean
    setTimeout(() => inputFonction.focus(), 50);
  }
}

function showHint() {
  hintZone.textContent = currentQuestion.hint;
  hintZone.classList.remove("hidden");
}

function cleanString(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-'`]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

const detailLabels = new Set([
  "cod",
  "coi",
  "cdn",
  "complement du nom",
  "complement dobjet direct",
  "complement dobjet indirect",
  "complement de lantcedent",
  "complement de lantecedent",
  "complement du cod",
  "complement du sujet",
]);

function needsDetail(answer) {
  return detailLabels.has(cleanString(answer));
}

function isIncompleteAnswer(userAnswer, expectedAnswer) {
  if (!needsDetail(expectedAnswer)) return false;
  if (userAnswer === expectedAnswer) return true;
  return !/\sde\s/.test(userAnswer);
}

function getCompletionHint(answer) {
  const normalized = cleanString(answer);
  if (normalized.includes("cod") && !normalized.includes("complement")) {
    return "COD de [verbe]";
  }
  if (normalized.includes("coi")) {
    return "COI de [verbe]";
  }
  if (normalized.includes("cdn") || normalized.includes("complement du nom")) {
    return "CDN de [nom]";
  }
  if (
    normalized.includes("complement de lantcedent") ||
    normalized.includes("complement de lantécédent")
  ) {
    return "complément de l'antécédent de [nom]";
  }
  if (
    normalized.includes("complement dobjet direct") ||
    normalized.includes("complement dobjet indirect")
  ) {
    return "complément d'objet direct/indirect de [verbe]";
  }
  return answer;
}

function checkAnswers(isSkipped = false) {
  let userAnswer = "";
  let typeQuestion = currentQuestion.type.trim().toLowerCase();

  // 1. Récupération et traitement de la réponse
  if (!isSkipped) {
    if (typeQuestion.startsWith("nature")) {
      userAnswer = checkAbreviations(cleanString(inputNature.value));
      // CORRECTION : Ne pas écraser brutalement la saisie de l'utilisateur pendant l'affichage du feedback
    } else {
      userAnswer = checkAbreviations(cleanString(inputFonction.value));
    }

    // Sécurité champ vide
    if (userAnswer === "") {
      feedbackZone.className = "feedback-box wrong flash-error";
      feedbackZone.innerHTML = "<strong>Champ de réponse vide !</strong>";
      feedbackZone.classList.remove("hidden");

      setTimeout(() => {
        feedbackZone.classList.remove("flash-error");
      }, 900);

      return;
    }
  }

  totalQuestions++;
  let isCorrect = false;
  let isAnIncompleteAnswer = false;
  const expectedAnswer = cleanString(currentQuestion.answer);

  // 2. LOGIQUE DE VALIDATION
  if (!isSkipped) {
    // CORRECTION : Listes exhaustives alignées avec cleanString()
    const listeNatures = [
      "adjectif",
      "nom",
      "verbe",
      "determinant",
      "adverbe",
      "pronom",
      "conjonction",
      "interjection",
      "groupe nominal",
      "proposition",
      "preposition",
      "participe passe",
      "participe present",
    ];
    const listeFonctions = [
      "sujet",
      "cod",
      "coi",
      "complement circonstanciel",
      "attribut",
      "apposition",
      "epithete",
      "complement du nom",
      "complement de lantecedent",
      "complement dagent",
      "cdn",
    ];

    let aConfondu = false;

    if (typeQuestion.startsWith("fonction")) {
      aConfondu = listeNatures.some((nature) => {
        const regex = new RegExp(`\\b${nature}\\b`, "i");
        return regex.test(userAnswer) && !expectedAnswer.includes(nature);
      });
    } else if (typeQuestion.startsWith("nature")) {
      aConfondu = listeFonctions.some((fonction) => {
        const regex = new RegExp(`\\b${fonction}\\b`, "i");
        return regex.test(userAnswer) && !expectedAnswer.includes(fonction);
      });
    }

    // CORRECTION : Utilisation de conditions distinctes pour ne pas bloquer l'évaluation
    if (aConfondu) {
      isCorrect = false;
    } else if (userAnswer === expectedAnswer) {
      isCorrect = true;
    } else if (
      isIncompleteAnswer(userAnswer, expectedAnswer) &&
      userAnswer !== expectedAnswer
    ) {
      isAnIncompleteAnswer = true;
    } else if (userAnswer.includes(expectedAnswer)) {
      isCorrect = true;
    } else if (
      expectedAnswer === "adjectif qualificatif" &&
      userAnswer === "adjectif"
    ) {
      isCorrect = true;
    } else if (
      expectedAnswer === "conjonction de subordination" &&
      userAnswer === "conjonction"
    ) {
      isCorrect = true;
    }
  }

  // 3. Traitement du résultat et affichage du feedback
  if (isSkipped) {
    feedbackZone.className = "feedback-box wrong";
    feedbackZone.innerHTML = `<strong>Question passée.</strong> La bonne réponse pour <i>"${currentQuestion.target}"</i> était : <strong>${currentQuestion.answer}</strong>.`;
  } else if (isCorrect) {
    score++;
    const randomCompliment =
      compliments[Math.floor(Math.random() * compliments.length)];
    feedbackZone.className = "feedback-box correct";
    feedbackZone.innerHTML = `<strong>${randomCompliment}</strong> C'est tout à fait ça !`;
  } else if (isAnIncompleteAnswer) {
    feedbackZone.className = "feedback-box wrong";
    feedbackZone.innerHTML = `<strong>Réponse incomplète.</strong> Précise ta réponse comme : <em>${getCompletionHint(currentQuestion.answer)}</em>.`;
  } else {
    feedbackZone.className = "feedback-box wrong";
    feedbackZone.innerHTML = `<strong>Oups !</strong> La bonne réponse pour <i>"${currentQuestion.target}"</i> était : <strong>${currentQuestion.answer}</strong>.`;
  }

  feedbackZone.classList.remove("hidden");
  submitBtn.classList.add("hidden");
  hintBtn.classList.add("hidden");
  skipBtn.classList.add("hidden");
  nextBtn.classList.remove("hidden");

  addStatsEntry(isCorrect);
  addSessionStatsEntry(isCorrect);
  updateScoreDisplay();
}

function checkAbreviations(input) {
  const abbreviations = {
    // Natures
    det: "determinant",
    adj: "adjectif",
    adv: "adverbe",
    gn: "groupe nominal",
    prep: "preposition",
    "grp prep": "groupe prepositionnel",
    conj: "conjonction",
    vb: "verbe",
    pp: "participe passe",
    prop: "proposition",

    // Fonctions
    suj: "sujet",
    cod: "complement dobjet direct", // Aligné avec le cleanString potentiel
    coi: "complement dobjet indirect",
    cc: "complement circonstanciel",
    cdn: "complement du nom",
    attr: "attribut",
    epith: "epithete",
  };
  return abbreviations[input] || input;
}

function getDisplayedStatsEntries() {
  return statsOrigin === "session" ? sessionStatsEntries : statsEntries;
}

function updateStatsDisplay() {
  const currentEntries = getDisplayedStatsEntries();
  const totalAttempts = currentEntries.length;
  const totalCorrect = currentEntries.filter((item) => item.correct).length;
  const rate = totalAttempts
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0;

  statsTotalEl.textContent = totalAttempts;
  statsCorrectEl.textContent = totalCorrect;
  statsRateEl.textContent = `${rate}%`;

  statsSubtitle.textContent =
    statsOrigin === "session"
      ? "Depuis le début de la partie actuelle."
      : "Depuis le début de l'application.";
}

function loadStats() {
  const stored = localStorage.getItem(statsKey);
  if (stored) {
    try {
      statsEntries = JSON.parse(stored);
      if (!Array.isArray(statsEntries)) throw new Error("Données invalides");
    } catch (e) {
      statsEntries = [];
    }
  }
  updateProgressSummary();
}

function saveStats() {
  localStorage.setItem(statsKey, JSON.stringify(statsEntries));
  updateProgressSummary();
}

function updateProgressSummary() {
  if (!progressSummary) return;
  const totalAttempts = statsEntries.length;
  const totalCorrect = statsEntries.filter((item) => item.correct).length;
  if (totalAttempts === 0) {
    progressSummary.textContent =
      "✅ (sauvegardé) aucune donnée pour l’instant.";
    return;
  }
  const rate = Math.round((totalCorrect / totalAttempts) * 100);
  progressSummary.textContent = `✅ ${totalAttempts} essais, ${totalCorrect} réussites, taux ${rate}%`;
}

function addStatsEntry(correct) {
  statsEntries.push({ time: Date.now(), correct });
  saveStats();
}

function addSessionStatsEntry(correct) {
  sessionStatsEntries.push({ time: Date.now(), correct });
}

function resetStats() {
  if (!confirm("Réinitialiser les statistiques et repartir de zéro ?")) {
    return;
  }
  if (statsOrigin === "session") {
    sessionStatsEntries = [];
  } else {
    statsEntries = [];
    saveStats();
  }
  updateStatsPanel();
  updateProgressSummary();
}

function getPeriodStart(period) {
  const now = Date.now();
  switch (period) {
    case "1h":
      return now - 60 * 60 * 1000;
    case "1d":
      return now - 24 * 60 * 60 * 1000;
    case "1m":
      return now - 30 * 24 * 60 * 60 * 1000;
    case "1y":
      return now - 365 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

function updateStatsPanel() {
  updateStatsDisplay();
  drawStatsChart();
}

function drawStatsChart() {
  const ctx = statsChart.getContext("2d");
  const rect = statsChart.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  statsChart.width = rect.width * dpr;
  statsChart.height = 320 * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const width = rect.width;
  const height = 320;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
  ctx.fillRect(0, 0, width, height);

  const periodStart = getPeriodStart(selectedStatsPeriod);
  const displayedEntries = getDisplayedStatsEntries();
  const filtered = displayedEntries.filter(
    (entry) => entry.time >= periodStart,
  );

  const title = `Période : ${selectedStatsPeriod}`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "16px Quicksand, sans-serif";
  ctx.fillText(title, 18, 28);

  const gridColor = "rgba(255, 255, 255, 0.12)";
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = 50 + (i * (height - 80)) / 4;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(width - 18, y);
    ctx.stroke();
  }

  const xAxisY = height - 30;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.beginPath();
  ctx.moveTo(40, xAxisY);
  ctx.lineTo(width - 18, xAxisY);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "12px Quicksand, sans-serif";
  for (let i = 0; i <= 4; i++) {
    const value = 100 - i * 25;
    ctx.fillText(`${value}%`, 8, 54 + (i * (height - 80)) / 4);
  }

  if (filtered.length === 0) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "16px Quicksand, sans-serif";
    ctx.fillText("Aucune donnée pour cette période.", 40, height / 2);
    return;
  }

  const entries = filtered.slice().sort((a, b) => a.time - b.time);
  const startTime = Math.min(entries[0].time, Date.now() - 1);
  const endTime = Date.now();
  const timeSpan = endTime - startTime || 1;

  let cumulativeCorrect = 0;
  const points = entries.map((item, index) => {
    cumulativeCorrect += item.correct ? 1 : 0;
    const ratio = cumulativeCorrect / (index + 1);
    const x = 40 + ((item.time - startTime) / timeSpan) * (width - 62);
    const y = 50 + (1 - ratio) * (height - 80);
    return { x, y };
  });

  ctx.strokeStyle = "rgba(59, 130, 246, 0.95)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();

  ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.lineTo(points[points.length - 1].x, xAxisY);
  ctx.lineTo(points[0].x, xAxisY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "12px Quicksand, sans-serif";
  ctx.fillText(
    new Date(startTime).toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    42,
    height - 10,
  );
  ctx.textAlign = "right";
  ctx.fillText(
    new Date(endTime).toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    width - 20,
    height - 10,
  );
  ctx.textAlign = "left";
}

function updateScoreDisplay() {
  progressTrack.textContent = `Score : ${score}/${totalQuestions}`;
}
