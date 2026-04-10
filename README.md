# p5js-todo

Een todo app in p5.js, gebouwd met de **Ralph Wiggum loop** en **OpenSpec**.

> Dit project is een proeftuin voor een nieuwe manier van AI-gedreven ontwikkeling:
> jij beschrijft wat je wilt → AI maakt het plan → AI bouwt het, stap voor stap.

---

## 🧠 Hoe werkt dit?

De aanpak bestaat uit drie rollen:

| Stuk | Wat het doet |
|---|---|
| **OpenSpec** | Jij beschrijft wat je wilt. OpenSpec schrijft het plan (`tasks.md`). |
| **Ralph Wiggum loop** | Copilot pakt één taak uit het plan, bouwt het, commit het, stopt. Herhaal. |
| **GitHub Copilot CLI** | De AI die het werk uitvoert. |

Het idee: **één taak per sessie, schone context elke keer.** Zo blijft de AI scherp.

---

## ✅ Wat heb je nodig?

Installeer dit één keer op je computer:

```powershell
# 1. GitHub Copilot CLI
winget install GitHub.Copilot

# 2. OpenSpec (vereist Node.js)
npm install -g @fission-ai/openspec@latest
```

Je hebt ook een **actief GitHub Copilot abonnement** nodig.  
Bij de eerste keer starten van Copilot CLI word je gevraagd in te loggen met `/login`.

---

## 🚀 Aan de slag

### Stap 1 — Vertel wat je wilt bouwen (OpenSpec)

Ga naar de projectmap en start Copilot CLI:

```powershell
cd C:\data\p5js-todo
copilot
```

Je ziet de Copilot CLI opstarten. Typ dit (vervang de beschrijving door jouw wensen):

```
Use the /openspec-propose skill to propose a new change.
I want to build a todo app with the following features:
- Add todos via an input field
- Show todos in a list
- Check off a todo (strikethrough)
- Delete a todo
- Store todos in localStorage so they survive a page refresh
- Dark theme, minimal design
```

Copilot gaat nu vragen stellen en vervolgens automatisch deze bestanden aanmaken:

```
openspec/changes/todo-app/
  proposal.md    ← beschrijving van de feature
  specs/         ← de requirements
  design.md      ← hoe het technisch werkt
  tasks.md       ← de lijst van taken die Ralph gaat uitvoeren  ⬅ dit is het plan
```

**Sluit Copilot CLI** als de bestanden aangemaakt zijn (Ctrl+C twee keer, of typ `/exit`).

> 💡 **Tip:** Open `openspec/changes/todo-app/tasks.md` en lees of de taken kloppen.  
> Je mag taken toevoegen, verwijderen of herformuleren. Het is jouw plan.

---

### Stap 2 — Laat Ralph bouwen (loop)

Nu gaat de magie beginnen. Start de loop:

```powershell
.\loop.ps1
```

**Wat er nu gebeurt:**

1. Het script leest de eerste openstaande taak uit `tasks.md`
2. Het start Copilot CLI met de Ralph agent: `copilot --agent ralph --prompt "implement the next task"`
3. De Ralph agent:
   - Leest het plan en de specs
   - Kijkt welke bestanden al bestaan
   - Schrijft de code
   - Controleert op fouten
   - Zet de taak op ✅ in `tasks.md`
   - Maakt een git commit
   - Stopt
4. Het script pusht naar GitHub
5. Het script vraagt: doorgaan? → typ `Y`

Herhaal totdat alle taken klaar zijn. Je kunt ook een maximum opgeven:

```powershell
.\loop.ps1 5    # stop na 5 taken
```

> 💡 **Tip:** Kijk mee wat de AI doet. Zie je dat het de verkeerde kant op gaat?  
> Stop dan (Ctrl+C), pas `tasks.md` aan, en start opnieuw.

---

### Stap 3 — App testen

Terwijl de loop draait (of daarna), kun je de app bekijken:

```powershell
npx serve .
```

Open dan `http://localhost:3000` in je browser.  
Druk F12 voor de browser console — geen errors = goed.

---

### Stap 4 — Afronden (archiveren)

Als alle taken klaar zijn, archiveer de change in Copilot CLI:

```
Use the /openspec-archive-change skill to archive the todo-app change
```

Dit ruimt de `openspec/changes/todo-app/` map op naar `openspec/archive/`.

---

## 📁 Bestanden uitgelegd

```
p5js-todo/
│
├── index.html                          ← de app (wordt door Ralph aangemaakt)
├── sketch.js                           ← de p5.js code (wordt door Ralph aangemaakt)
│
├── loop.ps1                            ← start de Ralph Wiggum loop
│
├── AGENTS.md                           ← automatisch geladen door Copilot CLI
│                                         bevat conventies en bekende valkuilen
│
├── .github/
│   ├── agents/
│   │   └── ralph.agent.md              ← de Ralph agent: instructies voor het bouwen
│   └── skills/
│       └── openspec-propose/
│           └── SKILL.md                ← de OpenSpec planning skill
│
└── openspec/
    └── changes/
        └── todo-app/
            ├── proposal.md             ← wat en waarom
            ├── specs/                  ← requirements
            ├── design.md              ← technische aanpak
            └── tasks.md               ← het plan (Ralph leest dit)
```

---

## ❓ Veelgestelde vragen

**De skill `/openspec-propose` werkt niet.**  
Typ het als: `Use the /openspec-propose skill to propose...` — met de volledige zin.  
Als dat ook niet werkt: `/skills reload` in Copilot CLI.

**De loop start maar doet niets.**  
Controleer of `openspec/changes/todo-app/tasks.md` bestaat en open taken (`- [ ]`) bevat.

**Ralph doet iets wat ik niet wil.**  
Stop de loop (Ctrl+C), pas `tasks.md` aan, en start opnieuw. Het plan is leidend.

**Kan ik nieuwe features toevoegen later?**  
Ja! Start opnieuw bij Stap 1 met een nieuwe beschrijving. OpenSpec maakt een nieuwe change folder aan.

---

## 🔗 Links

- [GitHub repository](https://github.com/michelschep/p5js-todo)
- [Ralph Wiggum loop uitleg](https://github.com/ghuntley/how-to-ralph-wiggum)
- [OpenSpec documentatie](https://openspec.pro)
- [GitHub Copilot CLI docs](https://docs.github.com/en/copilot/how-tos/copilot-cli)
