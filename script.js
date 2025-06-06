const board = document.getElementById("board");
const statusText = document.getElementById("status");
const currentPlayerText = document.getElementById("currentPlayer");

const players = ["green", "violet"];
let currentPlayer = 0;
let phase = "placing";
let stones = [9, 9];
let stonesOnBoard = [0, 0];
let positions = new Array(24).fill(null);
let selected = null;

const points = [[0, 0], [50, 0], [100, 0], [12.5, 12.5], [50, 12.5], [87.5, 12.5], [25, 25], [50, 25], [75, 25], [0, 50], [25, 50], [75, 50], [100, 50], [25, 75], [50, 75], [75, 75], [12.5, 87.5], [50, 87.5], [87.5, 87.5], [0, 100], [50, 100], [100, 100]]

const originalLines = [[0, 1], [1, 2], [0, 9], [2, 12], [3, 4], [4, 5], [3, 10], [5, 11], [6, 7], [7, 8], [6, 13], [8, 14], [9, 10], [10, 11], [9, 16], [11, 19], [12, 19], [12, 11], [13, 14], [13, 16], [14, 19], [15, 16], [16, 17], [15, 20], [17, 23], [18, 19], [18, 21], [19, 22]];

const points = [
  [0, 0], [50, 0], [100, 0],
  [10, 10], [50, 10], [90, 10],
  [20, 20], [50, 20], [80, 20],
  [0, 50], [20, 50], [80, 50], [100, 50],
  [20, 80], [50, 80], [80, 80],
  [10, 90], [50, 90], [90, 90],
  [0, 100], [50, 100], [100, 100]
];

const mills = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [15, 16, 17], [18, 19, 20], [21, 22, 23],
  [0, 9, 21], [3, 10, 18], [6, 11, 15],
  [1, 4, 7], [16, 19, 22], [8, 12, 17],
  [5, 13, 20], [2, 14, 23], [9, 10, 11],
  [12, 13, 14], [17, 16, 15], [20, 19, 18]
];

const moves = {
  0: [1, 9], 1: [0, 2, 4], 2: [1, 14],
  3: [4, 10], 4: [1, 3, 5, 7], 5: [4, 13],
  6: [7, 11], 7: [4, 6, 8], 8: [7, 12],
  9: [0, 10, 21], 10: [3, 9, 11, 18], 11: [6, 10, 15],
  12: [8, 13, 17], 13: [5, 12, 14, 20], 14: [2, 13, 23],
  15: [11, 16], 16: [15, 17, 19], 17: [12, 16],
  18: [10, 19], 19: [16, 18, 20, 22], 20: [13, 19],
  21: [9, 22], 22: [19, 21, 23], 23: [14, 22]
};

function drawBoard() {
  
  board.innerHTML = "";

  // Linien zeichnen
  const lines = originalLines;
    [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8],
    [15, 16], [16, 17], [18, 19], [19, 20], [21, 22], [22, 23],
    [0, 9], [9, 21], [3, 10], [10, 18], [6, 11], [11, 15],
    [1, 4], [4, 7], [16, 19], [8, 12], [12, 17], [5, 13],
    [13, 20], [2, 14], [14, 23]
  ];

  lines.forEach(([a, b]) => {
    const [x1, y1] = points[a];
    const [x2, y2] = points[b];
    const line = document.createElement("div");
    line.classList.add("line");
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.style.width = `${length}%`;
    line.style.left = `${x1}%`;
    line.style.top = `${y1}%`;
    line.style.transform = `rotate(${angle}deg)`;
    board.appendChild(line);
  });


  points.forEach((pos, index) => {
    const point = document.createElement("div");
    point.classList.add("point");
    point.style.left = `${pos[0]}%`;
    point.style.top = `${pos[1]}%`;
    if (positions[index]) {
      point.classList.add(positions[index]);
    }
    if (selected === index) point.style.border = "3px solid black";
    point.addEventListener("click", () => handleClick(index));
    board.appendChild(point);
  });

  currentPlayerText.textContent = players[currentPlayer] === "green" ? "Grün" : "Violett";
}

function handleClick(index) {
  const player = players[currentPlayer];
  const opponent = players[1 - currentPlayer];

  if (phase === "placing") {
    if (!positions[index]) {
      positions[index] = player;
      stones[currentPlayer]--;
      stonesOnBoard[currentPlayer]++;
      if (checkMill(index, player)) return requestRemove(opponent);
      switchTurn();
    }
  } else if (phase === "moving" || phase === "flying") {
    if (selected === null && positions[index] === player) {
      selected = index;
    } else if (selected !== null && positions[index] === null &&
      (phase === "flying" || moves[selected].includes(index))) {
      positions[index] = player;
      positions[selected] = null;
      selected = null;
      if (checkMill(index, player)) return requestRemove(opponent);
      switchTurn();
    } else {
      selected = null;
    }
  }

  drawBoard();

// Reset-Knopf einfügen
const reset = document.createElement("button");
reset.textContent = "Spiel zurücksetzen";
reset.onclick = resetGame;
board.appendChild(reset);

  checkPhaseTransition();
}

function requestRemove(opponent) {
  statusText.textContent = `Mühle! Entferne einen ${opponent}-Stein.`;
  board.querySelectorAll(".point").forEach((point, i) => {
    if (positions[i] === opponent && !checkMill(i, opponent)) {
      point.style.border = "3px dashed red";
      point.addEventListener("click", () => {
        positions[i] = null;
        stonesOnBoard[1 - currentPlayer]--;
        switchTurn();
        drawBoard();

// Reset-Knopf einfügen
const reset = document.createElement("button");
reset.textContent = "Spiel zurücksetzen";
reset.onclick = resetGame;
board.appendChild(reset);

        checkVictory();
      }, { once: true });
    }
  });
}

function checkMill(pos, player) {
  return mills.some(m => m.includes(pos) && m.every(i => positions[i] === player));
}

function switchTurn() {
  currentPlayer = 1 - currentPlayer;
  statusText.textContent = `Spieler ${players[currentPlayer] === "green" ? "Grün" : "Violett"} ist am Zug`;
}

function checkPhaseTransition() {
  if (stones[0] === 0 && stones[1] === 0 && phase === "placing") phase = "moving";
  for (let i = 0; i < 2; i++) {
    if (stonesOnBoard[i] === 3) phase = "flying";
  }
}

function checkVictory() {
  for (let i = 0; i < 2; i++) {
    if (stonesOnBoard[i] < 3 || !canMove(players[i])) {
      statusText.textContent = `Spieler ${players[1 - i] === "green" ? "Grün" : "Violett"} hat gewonnen!`;
      
  board.innerHTML = "";

  // Linien zeichnen
  const lines = originalLines;
    [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8],
    [15, 16], [16, 17], [18, 19], [19, 20], [21, 22], [22, 23],
    [0, 9], [9, 21], [3, 10], [10, 18], [6, 11], [11, 15],
    [1, 4], [4, 7], [16, 19], [8, 12], [12, 17], [5, 13],
    [13, 20], [2, 14], [14, 23]
  ];

  lines.forEach(([a, b]) => {
    const [x1, y1] = points[a];
    const [x2, y2] = points[b];
    const line = document.createElement("div");
    line.classList.add("line");
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.style.width = `${length}%`;
    line.style.left = `${x1}%`;
    line.style.top = `${y1}%`;
    line.style.transform = `rotate(${angle}deg)`;
    board.appendChild(line);
  });

    }
  }
}

function canMove(player) {
  return positions.some((p, i) => {
    if (p === player) {
      if (phase === "flying") return true;
      return moves[i].some(m => positions[m] === null);
    }
    return false;
  });
}

function resetGame() {
  currentPlayer = 0;
  phase = "placing";
  stones = [9, 9];
  stonesOnBoard = [0, 0];
  positions = new Array(24).fill(null);
  selected = null;
  statusText.textContent = "Spieler Grün ist am Zug";
  drawBoard();

// Reset-Knopf einfügen
const reset = document.createElement("button");
reset.textContent = "Spiel zurücksetzen";
reset.onclick = resetGame;
board.appendChild(reset);

}

drawBoard();

// Reset-Knopf einfügen
const reset = document.createElement("button");
reset.textContent = "Spiel zurücksetzen";
reset.onclick = resetGame;
board.appendChild(reset);

