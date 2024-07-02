const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

const board = [];
for (let row = 0; row < ROWS; row++) {
  board[row] = [];
  for (let col = 0; col < COLS; col++) {
    board[row][col] = 'white';
  }
}

let piece = {
  x: 0,
  y: 0,
  shape: [
    [1, 1],
    [1, 1]
  ]
};

let intervalId = null;
let gameOver = false;

function drawPiece() {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        ctx.fillStyle = 'blue';
        ctx.fillRect((piece.x + col) * BLOCK_SIZE, (piece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = '#ccc';
        ctx.strokeRect((piece.x + col) * BLOCK_SIZE, (piece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

function drawBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      ctx.fillStyle = board[row][col];
      ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawPiece();
}

function movePiece(direction) {
  if (gameOver) return;

  let canMove = true;

  switch (direction) {
    case 'left':
      piece.x--;
      break;
    case 'right':
      piece.x++;
      break;
    case 'down':
      piece.y++;
      break;
  }

  if (!validMove()) {
    canMove = false;
    switch (direction) {
      case 'left':
        piece.x++;
        break;
      case 'right':
        piece.x--;
        break;
      case 'down':
        piece.y--;
        placePiece();
        break;
    }
  }

  if (!canMove) {
    spawnPiece();
  }

  draw();
}

function validMove() {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        let newX = piece.x + col;
        let newY = piece.y + row;
        if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX] !== 'white') {
          return false;
        }
      }
    }
  }
  return true;
}

function placePiece() {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        board[piece.y + row][piece.x + col] = 'blue';
      }
    }
  }
  checkLines();
}

function spawnPiece() {
  piece.x = Math.floor(COLS / 2) - 1;
  piece.y = 0;
  piece.shape = randomPiece();
}

function randomPiece() {
  // Lista de peças (formas)
  const pieces = [
    [[1, 1], [1, 1]], // Quadrado
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // L invertido
    [[1, 1, 1, 1]], // Linha
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // Z invertido
    [[1, 1, 1], [0, 1, 0]] // T
  ];

  // Escolhe uma peça aleatória
  const randomIndex = Math.floor(Math.random() * pieces.length);
  return pieces[randomIndex];
}

function checkLines() {
  for (let row = ROWS - 1; row >= 0; row--) {
    let isFull = true;
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === 'white') {
        isFull = false;
        break;
      }
    }
    if (isFull) {
      // Remove a linha completa
      board.splice(row, 1);
      // Adiciona uma nova linha branca no topo
      board.unshift(Array(COLS).fill('white'));
    }
  }
}

function startGame() {
  intervalId = setInterval(() => {
    movePiece('down');
    if (gameOver) {
      clearInterval(intervalId);
    }
  }, 1000);
}

function resetGame() {
  gameOver = false;
  clearInterval(intervalId);
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      board[row][col] = 'white';
    }
  }
  spawnPiece();
  startGame();
}

document.addEventListener('keydown', function(event) {
  if (gameOver) return;

  if (event.key === 'a' || event.key === 'A') {
    movePiece('left');
  } else if (event.key === 'd' || event.key === 'D') {
    movePiece('right');
  } else if (event.key === 's' || event.key === 'S') {
    movePiece('down');
  }
});

spawnPiece();
startGame();

