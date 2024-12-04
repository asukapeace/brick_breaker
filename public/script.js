const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const brickWidth = 76;
const brickHeight = 30;
const paddleWidth = 100;
const paddleHeight = 20;
const ballSize = 20;

// Game objects
const bricks = [];
const paddle = { x: canvas.width / 2, y: canvas.height - paddleHeight - 20 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 2, vy: 2 };

// Create bricks
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 8; j++) {
    const brickcolour = getRandomColour(); // Get a random colour for each brick
    bricks.push({ x: j * (brickWidth + 5), y: i * (brickHeight + 5), colour: brickcolour });
  }
}

function getRandomColour() {
  const colours = ['#008000', '#0000FF', '#FF0000', '#FFA500', '#800080'];
  return colours[Math.floor(Math.random() * colours.length)];
}

// Draw game objects
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballSize / 2, 0, Math.PI * 2);
  ctx.fill();
  for (let brick of bricks) {
    ctx.fillStyle = brick.colour; // Use the brick's colour when drawing
    ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
  }
}

// Update game state
function update() {
  // Move paddle
  if (paddle.x + paddleWidth > canvas.width) {
    paddle.x = canvas.width - paddleWidth;
  } else if (paddle.x < 0) {
    paddle.x = 0;
  }

  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Collision with walls
  if (ball.x + ballSize / 2 > canvas.width || ball.x - ballSize / 2 < 0) {
    ball.vx = -ball.vx;
  }
  if (ball.y - ballSize / 2 < 0) {
    ball.vy = -ball.vy;
  }

  // Collision with paddle
  if (ball.y + ballSize / 2 > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddleWidth) {
    ball.vy = -ball.vy;
  }

  // Collision with bricks
  for (let brick of bricks) {
    if (ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight) {
      bricks.splice(bricks.indexOf(brick), 1);
      ball.vy = -ball.vy;
    }
  }
}

// Handle user input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    paddle.x -= 10;
  } else if (e.key === 'ArrowRight') {
    paddle.x += 10;
  }
});

// Main game loop
setInterval(() => {
  update();
  draw();
}, 1000 / 60);