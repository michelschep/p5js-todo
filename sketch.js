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
    localStorage.setItem('p5todos', JSON.stringify(todos));
  } catch (e) {
    // storage unavailable — silent fail
  }
}

function draw() {
  background(30, 30, 46);
  drawInputField();
  drawTodoList();
}

function drawInputField() {
  // placeholder — implemented in task 3.1
}

function addTodo(txt) {
  todos.push(createTodo(txt));
  saveTodos();
}

function drawTodoList() {
  // placeholder — implemented in task 4.1
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
