/**
 * Main entry point for the procedural animal animation
 * p5.js version - migrated from Processing
 */

import { Fish } from './animals/Fish.js';
import { Snake } from './animals/Snake.js';
import { Lizard } from './animals/Lizard.js';

// Animal instances
let fish, snake, lizard;
let currentAnimal = 0;

// Animal names for UI
const ANIMALS = ['鱼 (Fish)', '蛇 (Snake)', '蜥蜴 (Lizard)'];

/**
 * p5.js setup - runs once at start
 */
window.setup = function() {
  createCanvas(windowWidth, windowHeight);

  const center = createVector(width / 2, height / 2);
  fish = new Fish(center);
  snake = new Snake(center);
  lizard = new Lizard(center);
}

/**
 * p5.js draw loop - runs every frame
 */
window.draw = function() {
  background(40, 44, 52);

  // Render current animal
  const animals = [fish, snake, lizard];
  const current = animals[currentAnimal];
  current.resolve();
  current.display();

  // Display UI
  _drawUI();
}

/**
 * Cycle to next animal on mouse press
 */
window.mousePressed = function() {
  currentAnimal = (currentAnimal + 1) % 3;
}

/**
 * Handle window resize
 */
window.windowResized = function() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * Handle keyboard shortcuts
 */
window.keyPressed = function() {
  if (key === '1') currentAnimal = 0;
  if (key === '2') currentAnimal = 1;
  if (key === '3') currentAnimal = 2;
}

/**
 * Draw UI overlay showing current animal
 * @private
 */
function _drawUI() {
  fill(255);
  noStroke();
  textSize(24);
  textAlign(LEFT, TOP);
  text(`当前动物: ${ANIMALS[currentAnimal]}`, 20, 20);

  textSize(16);
  text('点击切换 | 移动鼠标控制', 20, 55);
  text('键盘快捷键: 1=鱼, 2=蛇, 3=蜥蜴', 20, 80);
}
