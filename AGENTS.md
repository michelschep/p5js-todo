# AGENTS.md

> Automatisch geladen door GitHub Copilot CLI bij elke sessie.
> Bevat de Ralph loop-instructies én project-specifieke kennis.
> Voeg operationele learnings toe onderaan wanneer je iets nieuws ontdekt.

---

## 🏗️ Tech Stack

- **Taal:** JavaScript (vanilla)
- **Framework:** p5.js (via CDN)
- **Structuur:** `index.html` + `sketch.js`
- **Serveren:** `npx serve .` — nooit direct `file://` openen

---

## 📁 Project structuur

```
index.html          ← HTML shell + p5.js CDN import
sketch.js           ← alle p5.js logica
openspec/
  changes/
    <feature>/
      proposal.md
      specs/
      tasks.md      ← Ralph leest dit
  archive/
```

---

## 🔨 Ontwikkelen & testen

```bash
npx serve .         # start lokale server op http://localhost:3000
```

Open de browser console (F12) — geen errors = klaar om te committen.

---

## ⚠️ p5.js valkuilen

- **Nooit p5 reserved names gebruiken als variabelen:** `width`, `height`, `color`, `fill`, `stroke`, `random`, `map`, `text`, `key`, `image`, etc.
- **Altijd via HTTP serveren** — `npx serve .`, nooit `file://` (fetch faalt anders)
- **Nooit** `fill('#hex', alpha)` — gebruik `fill(r, g, b, alpha)` of `color(r, g, b, alpha)`
- **Flex column layouts:** voeg `flex-shrink: 0` toe aan elementen met vaste hoogte

---

## 📝 Operationele learnings

<!-- Voeg ontdekkingen toe. Formaat: "- [YYYY-MM-DD] <wat je leerde>" -->
