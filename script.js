let board = [];
let players = [];
let currentPlayer = 0;

function createBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board = [];

  for (let i = 0; i < 121; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    if ([0, 10, 110, 120].includes(i)) {
      cell.classList.add("home");
    } else if (i >= 44 && i <= 76 && i % 11 === 5) {
      cell.classList.add("path");
    } else {
      cell.classList.add("goal");
    }

    cell.id = "cell-" + i;
    board.push(cell);
    boardDiv.appendChild(cell);
  }
}

function startGame() {
  const count = parseInt(document.getElementById("player-count").value);
  players = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: ["red", "green", "blue", "yellow"][i],
    pos: 0,
    home: 11 * i,
  }));
  currentPlayer = 0;
  createBoard();
  drawPieces();
}

function drawPieces() {
  document.querySelectorAll(".piece").forEach(p => p.remove());
  players.forEach(p => {
    const piece = document.createElement("div");
    piece.className = "piece " + p.color;
    const pos = p.home + (p.pos % 10);
    const cell = document.getElementById("cell-" + pos);
    if (cell) cell.appendChild(piece);
  });
}

function rollDice() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice1").innerText = getDiceSymbol(d1);
  document.getElementById("dice2").innerText = getDiceSymbol(d2);
  document.getElementById("dice-sum").innerText = "Summe: " + (d1 + d2);
  movePlayer(d1 + d2);
}

function getDiceSymbol(num) {
  return ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][num - 1];
}

function movePlayer(steps) {
  players[currentPlayer].pos += steps;
  drawPieces();
  currentPlayer = (currentPlayer + 1) % players.length;
}
