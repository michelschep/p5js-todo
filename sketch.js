// Global state
let todos = [];
let inputStr = '';
let scrollOffset = 0;
let inputFocused = true;

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

function draw() {
  background(30, 30, 46);
  drawInputField();
  drawTodoList();
}

function drawInputField() {
  // placeholder — implemented in task 3.1
}

function drawTodoList() {
  // placeholder — implemented in task 4.1
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
