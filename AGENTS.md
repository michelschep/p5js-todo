# AGENTS.md

> Automatisch geladen door GitHub Copilot CLI bij elke sessie.
> Bevat de Ralph loop-instructies én project-specifieke kennis.
> Voeg operationele learnings toe onderaan wanneer je iets nieuws ontdekt.

---

## 🔁 Ralph Loop — Sessie-instructies

Elke Copilot-sessie implementeert **precies één taak**. Niet meer.

### Werkwijze

1. **Orient** — Bestudeer `openspec/changes/*/proposal.md` en `openspec/changes/*/specs/` om de requirements te begrijpen.
2. **Lees taken** — Bestudeer `openspec/changes/*/tasks.md`. Kies de meest belangrijke incomplete taak (`- [ ]`) uit een niet-gearchiveerde change.
3. **Onderzoek** — Bestudeer relevante bestanden vóór je iets schrijft. Ga er nooit van uit dat iets nog niet geïmplementeerd is.
4. **Implementeer** — Schrijf de minimale, werkende implementatie.
5. **Valideer** — Open `index.html` via `npx serve .` en verifieer handmatig dat de feature werkt. Controleer ook de browser console op errors.
6. **Update taken** — Markeer de taak als gedaan in `tasks.md` (`- [x]`). Noteer eventuele ontdekkingen.
7. **Commit** — Formaat: `feat: <samenvatting>` + body met wat/waarom + trailer:
   ```
   Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
   ```
8. **Stop.** De volgende sessie pakt de volgende taak.

### Trigger

> `"implement the next task"`

### Invarianten (nooit schenden)

- `9999` — Eén taak per sessie. Nooit meerdere bundelen.
- `9998` — Nooit aannemen dat iets niet geïmplementeerd is — altijd bestaande code onderzoeken eerst.
- `9997` — Nooit committen als er console errors zijn.
- `9996` — Nooit onverwante code aanpassen.
- `9995` — `tasks.md` actueel houden na elke sessie.

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
