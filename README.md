# TechnoPixelConQuest

**Technopixel CodeQuest — The Knowledge Adventure**

A gamified programming-learning platform for Python, Java, and C++. Built with pure HTML5, CSS3, and Vanilla JavaScript.

---

## Features

- 🗺️ Structured learning paths — 4 chapters × 5 lessons per language (60 lessons total)
- 🧩 5 interactive exercise types: Multiple Choice, Fill in the Blank, Arrange the Code, Predict the Output, Find the Mistake
- ❓ Independent question banks with lazy loading (Python, Java, C++)
- ⭐ XP system with 5 levels (Beginner → Developer)
- 🔥 Daily streak tracking
- 🏆 10+ achievements
- 📜 Course completion certificates (Bronze / Silver / Gold tiers)
- 🎵 Background music and sound effects
- 💾 All progress saved in localStorage — no backend needed
- 📱 Fully responsive (desktop, tablet, mobile)

---

## Running Locally

1. Clone or download this repository.
2. Open the project folder in **VS Code**.
3. Install the **Live Server** extension (ritwickdey.LiveServer).
4. Right-click `index.html` → **Open with Live Server**.
5. The app opens in your browser at `http://127.0.0.1:5500`.

> Do **not** open `index.html` directly as a `file://` URL — audio and dynamic script loading require a local server.

---

## Project Structure

```
GameDevWorkshop2/
├── index.html          Main HTML shell
├── style.css           Design system and component styles
├── script.js           Application logic (all sections labelled)
├── README.md           This file
│
├── data/
│   └── questions/
│       ├── python.questions.js   Python question bank
│       ├── java.questions.js     Java question bank
│       └── cpp.questions.js      C++ question bank
│
└── assets/
    ├── branding/       Logos and badges
    ├── character/      Technopixie mascot images
    └── audio/          Background music and SFX
```

---

## How to Add a New Question

1. Open the relevant file, e.g. `data/questions/python.questions.js`.
2. Add a new object to the array before the closing `];`.
3. Use a unique `id` (e.g. `"py-q019"` — continue from the last number).
4. Follow this structure:

```js
{
  id: 'py-q019',
  language: 'python',        // must match the file's language
  topic: 'lists',            // any descriptive topic string
  difficulty: 'beginner',    // 'beginner' | 'intermediate' | 'advanced'
  type: 'multiple_choice',   // see supported types below
  question: 'What method adds an item to a Python list?',
  options: ['.add()', '.append()', '.insert()', '.push()'],
  correctAnswer: '.append()',
  explanation: 'list.append(item) adds an item to the end of the list.',
  hint: 'Think about attaching something to the end.',
  xp: 5
}
```

### Supported question types

| Type | Required fields |
|---|---|
| `multiple_choice` | `options`, `correctAnswer` |
| `predict_output` | `options`, `correctAnswer` |
| `find_mistake` | `options`, `correctAnswer` |
| `true_false` | `options: ['True','False']`, `correctAnswer` |
| `fill_blank` | `codeTemplate` (use `___` for blank), `acceptedAnswers` (array) |
| `arrange` | `blocks` (shuffled array), `correctOrder` (correct array) |

### Limits
- Maximum **500 questions per language**.
- All IDs must be **unique** within a language file.
- Invalid questions are skipped with a console warning — they never crash the app.

---

## Certificate System

Students earn certificates after:
1. Completing **all lessons** in all 4 chapters for a language.
2. Passing the **Final Assessment** (10 random questions, minimum 70%).

| Tier | Score |
|---|---|
| 🥉 Bronze — Foundations | 70–79% |
| 🥈 Silver — Practitioner | 80–89% |
| 🥇 Gold — Mastery | 90–100% |

Certificates can be viewed and printed (Save as PDF) from Settings or Profile.

---

## Audio Credits

Background music: `bgm_codequest.mp3` — Technopixel original audio.

If you replace this file, ensure you have the appropriate license and document it here.

---

## Tech Stack

- HTML5 · CSS3 · Vanilla JavaScript ES6+
- [Lucide Icons](https://lucide.dev/) (CDN)
- [Devicon](https://devicon.dev/) (CDN)
- Google Fonts: Inter, Fira Code
