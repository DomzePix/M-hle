const board = document.getElementById("board");
const statusText = document.getElementById("status");
const currentPlayerText = document.getElementById("currentPlayer");

const players = ["green", "violet"];
let currentPlayer = 0;
let phase = "placing"; // placing, moving, flying
let stones = [9, 9]; // restliche zu setzende Steine
let positions = new Array(24).fill(null); // Positionen auf dem Brett

// Positionen auf dem klassischen Mühlespielbrett (vereinfachte Darstellung)
const points = [
  [0, 0], [250, 0], [500, 0],
  [50, 50], [250, 50], [450, 50],
  [100, 100], [250, 100], [400, 100],
  [0, 250], [100, 250], [400, 250], [500, 250],
  [100, 400], [250, 400], [400, 400],
  [50, 450], [250, 450], [450, 450],
  [0, 500], [250, 500], [500, 500]
];

function drawBoard() {
  board.innerHTML = "";
  points.forEach((pos, index) => {
    const point = document.createElement("div");
    point.classList.add("point");
    point.style.left = `${pos[0]}px`;
    point.style.top = `${pos[1]}px`;
    if (positions[index] !== null) {
      point.classList.add(positions[index]);
    }
    point.addEventListener("click", () => handleClick(index));
    board.appendChild(point);
  });
}

function handleClick(index) {
  if (phase === "placing") {
    if (positions[index] === null && stones[currentPlayer] > 0) {
      positions[index] = players[currentPlayer];
      stones[currentPlayer]--;
      if (checkMill(index)) {
        // TODO: Mühle gebildet → Gegnerstein entfernen
        alert("Mühle gebildet! Gegnerstein entfernen.");
      }
      switchTurn();
    }
  }
  drawBoard();
}

function switchTurn() {
  currentPlayer = 1 - currentPlayer;
  currentPlayerText.textContent = players[currentPlayer] === "green" ? "Grün" : "Violett";
}

function checkMill(index) {
  // Platzhalter für Mühlenprüfung
  return false;
}

drawBoard();
