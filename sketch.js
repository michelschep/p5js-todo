// Global state
let todos = [];
let inputStr = '';
let scrollOffset = 0;
let inputFocused = true;

// Hit areas rebuilt each frame so mousePressed() (task 4.4) can detect clicks
let todoHitAreas = []; // [{ id, completeBtn:{x,y,r}, deleteBtn:{x,y,r} }]

const CARD_X = 40;
const CARD_H = 56;
const CARD_GAP = 8;
const CARD_RADIUS = 12;
const LIST_TOP = 96; // px below top of canvas, clears input field

// todo item: { id: string, text: string, status: 'active'|'completed',
//              animProgress: number (0–1), animState: 'enter'|'idle'|'complete'|'exit' }
function createTodo(txt) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: txt,
    status: 'active',
    animProgress: 0,
    animState: 'enter'
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  todos = loadTodos();
}

function loadTodos() {
  try {
    const stored = localStorage.getItem('p5todos');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveTodos() {
  try {
    const toSave = todos.filter(t => t.animState !== 'exit');
    localStorage.setItem('p5todos', JSON.stringify(toSave));
  } catch (e) {
    // storage unavailable — silent fail
  }
}

function draw() {
  background(30, 30, 46);
  removeExitedTodos();
  advanceAnimations();
  scrollOffset = constrain(scrollOffset, 0, maxScroll());
  drawInputField();
  drawTodoList();
}

// Advances animProgress each frame for animated states.
// Task 6.1: enter  0→1 (slide in from right)
// Task 6.2: exit   1→0 (fade + shrink)
// Task 6.3: complete pulse (handled there)
function advanceAnimations() {
  const ENTER_SPEED = 0.06; // ~17 frames ≈ 0.28 s at 60 fps
  const EXIT_SPEED  = 0.08; // ~12 frames ≈ 0.20 s at 60 fps
  for (const todo of todos) {
    if (todo.animState === 'enter') {
      todo.animProgress = min(1, todo.animProgress + ENTER_SPEED);
      if (todo.animProgress >= 1) {
        todo.animState = 'idle';
        todo.animProgress = 1;
      }
    } else if (todo.animState === 'exit') {
      todo.animProgress = max(0, todo.animProgress - EXIT_SPEED);
    }
  }
}

// Removes items whose exit animation has completed (animProgress ≤ 0).
// Task 6.2 drives animProgress from 1 → 0; until then items linger until
// their progress naturally reaches 0.
function removeExitedTodos() {
  todos = todos.filter(t => !(t.animState === 'exit' && t.animProgress <= 0));
}

function drawInputField() {
  const fieldX = 40;
  const fieldY = 24;
  const fieldW = width - 80;
  const fieldH = 48;
  const radius = 12;

  // Background
  noStroke();
  fill(49, 49, 68);
  rect(fieldX, fieldY, fieldW, fieldH, radius);

  // Cursor or placeholder
  const displayText = inputStr.length > 0 ? inputStr : null;

  textSize(16);
  textAlign(LEFT, CENTER);
  noStroke();

  if (displayText) {
    fill(205, 214, 244);
    text(displayText, fieldX + 16, fieldY + fieldH / 2);
  } else {
    fill(108, 112, 134);
    text('Add a new todo…', fieldX + 16, fieldY + fieldH / 2);
  }

  // Blinking cursor when focused
  if (inputFocused && frameCount % 60 < 30) {
    const cursorX = fieldX + 16 + (inputStr.length > 0 ? textWidth(inputStr) : 0);
    stroke(137, 180, 250);
    strokeWeight(2);
    line(cursorX + 2, fieldY + 12, cursorX + 2, fieldY + fieldH - 12);
    noStroke();
  }
}

function keyTyped() {
  if (inputFocused) {
    inputStr += key;
  }
  return false; // prevent default browser behavior (e.g. space scrolling)
}

function keyPressed() {
  if (!inputFocused) return;
  if (keyCode === BACKSPACE) {
    inputStr = inputStr.slice(0, -1);
    return false;
  }
  if (keyCode === ENTER) {
    if (inputStr.trim().length > 0) {
      addTodo(inputStr.trim());
      inputStr = '';
    }
    return false;
  }
}

function addTodo(txt) {
  todos.push(createTodo(txt));
  saveTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.status = todo.status === 'active' ? 'completed' : 'active';
  todo.animState = 'complete';
  todo.animProgress = 0;
  saveTodos();
}

function deleteTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.animState = 'exit';
  todo.animProgress = 1; // exit animation drives 1 → 0 (task 6.2)
  saveTodos();           // saves without this item (exit items excluded)
}

function drawTodoList() {
  todoHitAreas = [];
  const cardW = width - 80;

  // Include exit items while their animation is still running
  const visibleTodos = todos.filter(t => t.animState !== 'exit' || t.animProgress > 0);

  push();
  translate(0, -scrollOffset);

  let currentY = LIST_TOP; // accumulated Y to support dynamic (shrinking) card heights

  for (let i = 0; i < visibleTodos.length; i++) {
    const todo = visibleTodos[i];

    // Exit items: shrink height and fade proportionally to animProgress
    const exitP = todo.animState === 'exit' ? todo.animProgress : 1;
    const currentCardH = CARD_H * exitP;
    const cardY = currentY;
    currentY += currentCardH + CARD_GAP * exitP;

    if (todo.animState === 'exit') drawingContext.globalAlpha = exitP;

    // Slide-in offset for enter animation: ease-out quadratic, starts off-screen to the right
    let enterSlide = 0;
    if (todo.animState === 'enter') {
      const eased = 1 - pow(1 - todo.animProgress, 2);
      enterSlide = (1 - eased) * (width - CARD_X + 60);
    }
    push();
    translate(enterSlide, 0);

    // Card background — brighten on hover (mouseY is screen-space; compensate for scroll)
    const hovered = mouseX >= CARD_X && mouseX <= CARD_X + cardW &&
                    mouseY + scrollOffset >= cardY  && mouseY + scrollOffset <= cardY + currentCardH;
    noStroke();
    fill(hovered ? 62 : 49, hovered ? 62 : 49, hovered ? 82 : 68);
    rect(CARD_X, cardY, cardW, currentCardH, CARD_RADIUS);

    const btnR = 14;

    // Complete button (✓) — left side
    const complBtnX = CARD_X + 28;
    const complBtnY = cardY + currentCardH / 2;
    noStroke();
    if (todo.status === 'completed') {
      fill(137, 180, 250); // blue-filled when done
    } else {
      fill(74, 74, 98);
    }
    ellipse(complBtnX, complBtnY, btnR * 2, btnR * 2);
    fill(205, 214, 244);
    textSize(13);
    textAlign(CENTER, CENTER);
    text('\u2713', complBtnX, complBtnY);

    // Todo text — truncate with ellipsis if it overflows
    const textStartX = CARD_X + 56;
    const textEndX   = CARD_X + cardW - 44;
    const maxTextW   = textEndX - textStartX;
    textSize(16);
    textAlign(LEFT, CENTER);
    if (todo.status === 'completed') {
      fill(108, 112, 134);
    } else {
      fill(205, 214, 244);
    }
    let displayTxt = todo.text;
    if (textWidth(displayTxt) > maxTextW) {
      while (displayTxt.length > 0 && textWidth(displayTxt + '\u2026') > maxTextW) {
        displayTxt = displayTxt.slice(0, -1);
      }
      displayTxt += '\u2026';
    }
    text(displayTxt, textStartX, cardY + currentCardH / 2);

    // Strikethrough for completed items
    if (todo.status === 'completed') {
      const lineW = min(textWidth(displayTxt), maxTextW);
      stroke(108, 112, 134);
      strokeWeight(1.5);
      line(textStartX, cardY + currentCardH / 2, textStartX + lineW, cardY + currentCardH / 2);
      noStroke();
    }

    // Delete button (✗) — right side
    const delBtnX = CARD_X + cardW - 24;
    const delBtnY = cardY + currentCardH / 2;
    noStroke();
    fill(74, 74, 98);
    ellipse(delBtnX, delBtnY, btnR * 2, btnR * 2);
    fill(243, 139, 168); // rose accent
    textSize(13);
    textAlign(CENTER, CENTER);
    text('\u2717', delBtnX, delBtnY);

    // Store hit areas in screen-space Y (subtract scrollOffset) for mousePressed()
    // Skip exit items — they can't be interacted with while animating out
    if (todo.animState !== 'exit') {
      todoHitAreas.push({
        id: todo.id,
        completeBtn: { x: complBtnX, y: complBtnY - scrollOffset, r: btnR },
        deleteBtn:   { x: delBtnX,   y: delBtnY   - scrollOffset, r: btnR }
      });
    }

    pop(); // close enter-slide push
    if (todo.animState === 'exit') drawingContext.globalAlpha = 1;
  }

  pop();
}

function mousePressed() {
  // Toggle input focus: click inside input field → focus; click elsewhere → unfocus
  const fieldX = 40;
  const fieldY = 24;
  const fieldW = width - 80;
  const fieldH = 48;
  inputFocused = mouseX >= fieldX && mouseX <= fieldX + fieldW &&
                 mouseY >= fieldY && mouseY <= fieldY + fieldH;

  // Check clicks on todo buttons
  for (const area of todoHitAreas) {
    const cb = area.completeBtn;
    if (dist(mouseX, mouseY, cb.x, cb.y) <= cb.r) {
      toggleTodo(area.id);
      return;
    }
    const db = area.deleteBtn;
    if (dist(mouseX, mouseY, db.x, db.y) <= db.r) {
      deleteTodo(area.id);
      return;
    }
  }
}

// Returns the maximum valid scrollOffset given current todos and canvas size.
function maxScroll() {
  const renderTodos = todos.filter(t => t.animState !== 'exit' || t.animProgress > 0);
  let listH = 0;
  for (const t of renderTodos) {
    const p = t.animState === 'exit' ? t.animProgress : 1;
    listH += CARD_H * p + CARD_GAP * p;
  }
  if (listH > 0) listH -= CARD_GAP; // remove trailing gap
  const available = height - LIST_TOP - 16; // 16px bottom padding
  return max(0, listH - available);
}

function mouseWheel(event) {
  scrollOffset += event.delta;
  scrollOffset = constrain(scrollOffset, 0, maxScroll());
  return false; // prevent browser page scroll
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
