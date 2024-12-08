let cols = 10;
let rows = 20;
let grid = [];
let currentPiece;
let pieces = [];
let gameOver = false;

function setup() {
  createCanvas(300, 600);
  frameRate(10);
  // 初期化
  for (let i = 0; i < rows; i++) {
    grid[i] = Array(cols).fill(0);
  }
  // テトリミノ定義
  pieces = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
  ];
  newPiece();

}

function drawGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        fill(255);
        rect(x * 30, y * 30, 30, 30);
      }
    }
  }
}

function drawPiece() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        fill(200, 0, 200);
        rect((currentPiece.x + x) * 30, (currentPiece.y + y) * 30, 30, 30);
      }
    }
  }
}

function newPiece() {
  let shape = random(pieces);
  currentPiece = {
    shape: shape,
    x: Math.floor(cols / 2 - shape[0].length / 2),
    y: 0,
  };

  // 新しいピースが生成できない場合はゲームオーバー
  if (collides()) {
    gameOver = true;
  }
}

function movePiece() {
  currentPiece.y += 1;
  if (collides()) {
    currentPiece.y -= 1;
    lockPiece();
    newPiece();
  }
}

function collides() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (
        currentPiece.shape[y][x] &&
        (grid[currentPiece.y + y]?.[currentPiece.x + x] === 1 ||
          currentPiece.y + y >= rows)
      ) {
        return true;
      }
    }
  }
  return false;
}

function lockPiece() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        grid[currentPiece.y + y][currentPiece.x + x] = 1;
      }
    }
  }
  clearRows();
}

function clearRows() {
  for (let y = rows - 1; y >= 0; y--) {
    if (grid[y].every(cell => cell === 1)) {
      grid.splice(y, 1);
      grid.unshift(Array(cols).fill(0));
    }
  }
}

function keyPressed() {
  if (gameOver) return;

  if (keyCode === LEFT_ARROW) {
    currentPiece.x -= 1;
    if (collides() || currentPiece.x < 0) currentPiece.x += 1;
  } else if (keyCode === RIGHT_ARROW) {
    currentPiece.x += 1;
    if (collides() || currentPiece.x + currentPiece.shape[0].length > cols) currentPiece.x -= 1;
  } else if (keyCode === DOWN_ARROW) {
    currentPiece.y += 1;
    if (collides()) currentPiece.y -= 1;
  } else if (keyCode === UP_ARROW) {
    rotatePiece();
  }
}

function rotatePiece() {
  let rotated = [];
  let shape = currentPiece.shape;
  for (let x = 0; x < shape[0].length; x++) {
    rotated[x] = [];
    for (let y = shape.length - 1; y >= 0; y--) {
      rotated[x].push(shape[y][x]);
    }
  }

  let prevShape = currentPiece.shape;
  currentPiece.shape = rotated;

  if (
    collides() ||
    currentPiece.x < 0 ||
    currentPiece.x + currentPiece.shape[0].length > cols
  ) {
    currentPiece.shape = prevShape;
  }
}

let dropInterval = 300; // 1000ms = 1秒
let lastDropTime = 0;

function draw() {
  background(0);

  if (gameOver) {
    textSize(32);
    text("GAME OVER", width / 2, height / 2);
    noLoop();
    return;
  }

  let ctime = millis();
  if (ctime - lastDropTime > dropInterval) {
    currentPiece.y += 1;
    if (collides()) {
      currentPiece.y -= 1;
      lockPiece();
      newPiece();
    }
    lastDropTime = ctime; // タイミングをリセット
  }

  drawGrid();
  drawPiece();
  updateSpeed();
}

function updateSpeed() {
  dropInterval = max(200, dropInterval - 50); // 最小200msまで短縮
}

