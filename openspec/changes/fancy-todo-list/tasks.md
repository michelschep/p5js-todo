## 1. Foundation

- [x] 1.1 Update `index.html`: set page title, meta tags, ensure p5.js CDN script tag is present
- [x] 1.2 Set up `sketch.js` skeleton: `setup()`, `draw()`, global state variables (todos array, input string, scroll offset)
- [x] 1.3 Implement localStorage load on startup — deserialize todos array from `localStorage` or default to `[]`
- [x] 1.4 Implement localStorage save helper — called on every mutation (add, complete, delete)

## 2. Todo Data Model

- [x] 2.1 Define todo item structure: `{ id, text, status, animProgress, animState }`
- [x] 2.2 Implement `addTodo(text)` — creates item, sets `animState: 'enter'`, saves to localStorage
- [x] 2.3 Implement `toggleTodo(id)` — flips status between active/completed, sets `animState: 'complete'`, saves
- [x] 2.4 Implement `deleteTodo(id)` — sets `animState: 'exit'`; removes from array after animation completes

## 3. Canvas Input Field

- [x] 3.1 Draw input field rect with rounded corners and placeholder text at top of canvas
- [x] 3.2 Capture characters via `keyTyped()` — append to input string when input is focused
- [x] 3.3 Handle Backspace in `keyPressed()` — remove last character from input string
- [x] 3.4 Handle Enter in `keyPressed()` — call `addTodo()` if input non-empty, then clear input string

## 4. Todo Item Cards

- [x] 4.1 Draw each todo item as a rounded-rect card with text, complete button (✓), and delete button (✗)
- [x] 4.2 Apply completed item style — reduced opacity + strikethrough drawn manually over text
- [x] 4.3 Implement hover detection — `dist()` or bounding-box check against `mouseX/mouseY`; brighten card on hover
- [ ] 4.4 Wire `mousePressed()` — detect clicks on complete and delete buttons per item

## 5. Scrolling

- [ ] 5.1 Track `scrollOffset` variable; update via `mouseWheel()` event
- [ ] 5.2 Clamp scroll offset so list doesn't over-scroll above top or below last item
- [ ] 5.3 Apply `translate(0, -scrollOffset)` inside draw loop for item rendering

## 6. Animations

- [ ] 6.1 Drive `animProgress` (0→1) each frame for items in `animState: 'enter'` — slide in from right
- [ ] 6.2 Drive `animProgress` (1→0) each frame for items in `animState: 'exit'` — fade + shrink; remove item when done
- [ ] 6.3 Implement completion pulse — brief color flash over ~15 frames when `animState: 'complete'`

## 7. Empty State & Polish

- [ ] 7.1 Draw "Nothing to do — enjoy your day! 🎉" message centered on canvas when list is empty
- [ ] 7.2 Choose and apply a consistent color palette (background, cards, accent, text) throughout
- [ ] 7.3 Manual verification: serve with `npx serve .`, test add/complete/delete/reload/scroll/animations in browser
