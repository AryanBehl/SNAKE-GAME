const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake, direction, food, score, speed, interval, paused;
let highScore = localStorage.getItem("snakeHighScore") || 0;

document.getElementById("highScore").textContent = highScore;

function init() {
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  score = 0;
  speed = 150;
  paused = false;
  spawnFood();
  updateScore();
  startGame();
}

function spawnFood() {
  do {
    food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20)
    };
  } while (snake.some(p => p.x === food.x && p.y === food.y));
}

function drawGrid() {
  ctx.strokeStyle = "#111";
  for (let i = 0; i < 400; i += 20) {
    ctx.strokeRect(i, 0, 20, 400);
    ctx.strokeRect(0, i, 400, 20);
  }
}

function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  ctx.fillStyle = "#22c55e";
  snake.forEach(part => {
    ctx.fillRect(part.x * 20, part.y * 20, 20, 20);
  });

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
}

function update() {
  if (paused) return;

  let head = { ...snake[0] };

  if (direction === "RIGHT") head.x++;
  if (direction === "LEFT") head.x--;
  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    speed = Math.max(60, speed - 5);
    spawnFood();
    updateScore();
    restartInterval();
  } else {
    snake.pop();
  }

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= 20 || head.y >= 20 ||
    snake.slice(1).some(p => p.x === head.x && p.y === head.y)
  ) {
    gameOver();
  }
}

function gameOver() {
  clearInterval(interval);

  if (score > highScore) {
    localStorage.setItem("snakeHighScore", score);
  }

  alert("Game Over! Score: " + score);
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

function startGame() {
  interval = setInterval(gameLoop, speed);
}

function restartInterval() {
  clearInterval(interval);
  startGame();
}

function gameLoop() {
  update();
  draw();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";

  if (e.code === "Space") {
    paused = !paused;
  }
});

function restartGame() {
  clearInterval(interval);
  init();
}

init();