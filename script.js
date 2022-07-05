const squares = document.querySelectorAll(".square");
let turn = ["red", "yellow"][Math.round(Math.random())];
let playing = true;

squares.forEach((square) => {
  square.addEventListener("click", MakeMove);
});

function MakeMove(e) {
  if (!playing) return;
  if (!ValidateMove(e.target)) return;

  e.target.classList.add(turn);
  CheckWin(e.target);
  ChangeTurn();
}

function ChangeTurn() {
  if (turn === "red") {
    turn = "yellow";
  } else {
    turn = "red";
  }
}

function ValidateMove(square) {
  // check if square is availabe
  if (square.classList.contains("red") || square.classList.contains("yellow")) {
    return false;
  }

  // check if square is reachable
  let indexOfSquare = [...squares].indexOf(square);

  if (indexOfSquare > 6) {
    let belowSquare = squares[indexOfSquare - 7];
    if (!CheckSquare(belowSquare)) {
      return false;
    }
  }
  return true;
}

function CheckSquare(square) {
  if (square.classList.contains("red")) {
    return "red";
  } else if (square.classList.contains("yellow")) {
    return "yellow";
  }
  return false;
}

function CheckWin(square) {
  let i = [...squares].indexOf(square);

  /*
    top-left, top, top-right --> 6, 7, 8
    ctr-left, [*], ctr-right --> -1, 1
    btm-left, btm, btm-right --> -8, -7, -6
  */

  let directions = [6, 7, 8, -1, 1, -6, -7, -8];

  /*
    it's a little bit complicated, so focus:
      1. loop hover directions
      2. on each dir, check the path from the square that was clicked to the direction.                      --> [y][y][y][clicked] 
      3. also on each dir: check the square index + dir, from there go in the opposite direction of the dir. --> [y][y][clicked][y]
  */

  for (let dir of directions) {
    let frmClickedSquare = CheckDir(squares[i], dir);
    let frmDirSquare = [...squares][i + dir];

    if (frmDirSquare) frmDirSquare = CheckDir(frmDirSquare, dir * -1);

    if (frmClickedSquare || frmDirSquare) {
      playing = false;
      alert(`${turn} wins!`);
      break;
    }
  }
  if (checkForDraw()) {
    playing = false;
    alert(`its a draw!`);
  }
}

function checkForDraw() {
  for (let square of squares) {
    if (!CheckSquare(square)) return false;
  }
  return true;
}

function CheckDir(square, dir, sum = 0) {
  if (CheckSquare(square) !== turn) return false;

  if (dir * 3 === sum) return true;

  let i = [...squares].indexOf(square);

  // if i - dir, or i + dir, is on the same row, return false.
  if (dir === -8 && i % 7 === 0) return false;
  if (dir === 6 && i % 7 === 0) return false;
  if (dir === -6 && (i + 1) % 7 === 0) return false;
  if (dir === 8 && (i + 1) % 7 === 0) return false;

  let nextSquare = squares[i + dir];
  if (!nextSquare) return false;
  return CheckDir(nextSquare, dir, sum + dir);
}

// function drawIndexes() {
//   [...squares].forEach((square, index) => (square.innerHTML = index));
// }
// drawIndexes();
