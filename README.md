<div align="center">

  <img src="assets/logo.png" alt="GigaGrammaire Logo" width="120" height="120" />

  # 📚 GigaGrammaire

  **L'application web ultime pour s'entraîner et maîtriser la grammaire française.**

  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
  [![HTML5](https://img.shields.io/badge/HTML5-Sémantique-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-Modern_UI-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

  <br />

  [🚀 Lancement rapide](#-lancement-rapide) • [✨ Fonctionnalités](#-fonctionnalités) • [🛠️ Stack Technique](#%EF%B8%8F-stack-technique) • [👨‍💻 Auteur](#-auteur)

</div>

---

> [!NOTE]
> **GigaGrammaire** fonctionne intégralement côté client (Vanilla JS). Aucune installation de dépendances lourdes (`npm`, `node_modules`) ni de backend n'est requise.

## ✨ Fonctionnalités

- **🧠 Exercices dynamiques** : Injection en temps réel des questions depuis la base de données `assets/sentences.json`.
- **⚡ Correction instantanée** : Validation immédiate des choix avec feedback visuel et réponses guidées.
- **📈 Suivi de progression** : Calcul du score final et bilan par série d'exercices.
- **🎨 UI Épurée & Responsive** : Interface fluide construite avec des variables CSS, parfaitement adaptée au mobile et au desktop.
- **🔒 Confidentialité totale** : Aucun suivi externe ni stockage de données personnelles.

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle dans l'application |
| :--- | :--- | :--- |
| **Structure** | `HTML5 Sémantique` | Organisation du DOM, accessibilité et conteneurs d'exercices |
| **Styles** | `CSS3 (Variables & Flexbox)` | Design moderne, animations fluides et gestion des thèmes |
| **Logique** | `JavaScript ES6+` | Chargement dynamique via `fetch()`, gestion d'état et évaluation |
| **Données** | `JSON (`sentences.json`)` | Stockage des questions, choix multiples et bonnes réponses |

---

## 📁 Structure du projet

```text
GigaGrammaire/
├── 📁 assets/
│   ├── 🖼️ logo.png           # Logo officiel
│   └── 📄 sentences.json     # Banque de questions et réponses
├── 📄 index.html             # Interface principale
├── 📄 script.js              # Moteur applicatif et gestion du score
├── 📄 style.css              # Variables de style et mise en page
└── 📄 README.md              # Documentation du dépôt
