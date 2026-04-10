// Global state
let todos = [];
let inputStr = '';
let scrollOffset = 0;
let inputFocused = true;

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
  // placeholder — implemented in task 3.1
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
  // placeholder — implemented in task 4.1
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
