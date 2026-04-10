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
  drawInputField();
  drawTodoList();
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

  // Skip items in exit animState (they're invisible; task 6.2 drives their removal)
  const visibleTodos = todos.filter(t => t.animState !== 'exit');

  for (let i = 0; i < visibleTodos.length; i++) {
    const todo = visibleTodos[i];
    const cardY = LIST_TOP + i * (CARD_H + CARD_GAP);

    // Card background — brighten on hover
    const hovered = mouseX >= CARD_X && mouseX <= CARD_X + cardW &&
                    mouseY >= cardY  && mouseY <= cardY + CARD_H;
    noStroke();
    fill(hovered ? 62 : 49, hovered ? 62 : 49, hovered ? 82 : 68);
    rect(CARD_X, cardY, cardW, CARD_H, CARD_RADIUS);

    const btnR = 14;

    // Complete button (✓) — left side
    const complBtnX = CARD_X + 28;
    const complBtnY = cardY + CARD_H / 2;
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
    text(displayTxt, textStartX, cardY + CARD_H / 2);

    // Strikethrough for completed items
    if (todo.status === 'completed') {
      const lineW = min(textWidth(displayTxt), maxTextW);
      stroke(108, 112, 134);
      strokeWeight(1.5);
      line(textStartX, cardY + CARD_H / 2, textStartX + lineW, cardY + CARD_H / 2);
      noStroke();
    }

    // Delete button (✗) — right side
    const delBtnX = CARD_X + cardW - 24;
    const delBtnY = cardY + CARD_H / 2;
    noStroke();
    fill(74, 74, 98);
    ellipse(delBtnX, delBtnY, btnR * 2, btnR * 2);
    fill(243, 139, 168); // rose accent
    textSize(13);
    textAlign(CENTER, CENTER);
    text('\u2717', delBtnX, delBtnY);

    todoHitAreas.push({
      id: todo.id,
      completeBtn: { x: complBtnX, y: complBtnY, r: btnR },
      deleteBtn:   { x: delBtnX,   y: delBtnY,   r: btnR }
    });
  }
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
