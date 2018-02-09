const tictactoe = require("./tictactoe")
let field = [[null, null, null], [null, null, null], [null, null, null]]
let player = "X"
setupField()

function setupField() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(event) {
      for (let row = 0; row <= 2; row++) {
        for (let col = 0; col <= 2; col++) {
          document
            .getElementById(`${row}${col}`)
            .addEventListener("click", clickOnGrid)
        }
      }
      document
        .getElementById("reset-btn")
        .addEventListener("click", resetButton)
      document.getElementById("reset-btn").style.visibility = "hidden"
    })
  } else {
    for (let row = 0; row <= 2; row++) {
      for (let col = 0; col <= 2; col++) {
        document
          .getElementById(`${row}${col}`)
          .addEventListener("click", clickOnGrid)
      }
    }
  }
}

function clickOnGrid() {
  const row = this.parentElement.dataset.row
  const col = this.dataset.col
  fillField(row, col)
  checkFieldState(tictactoe.whoIsWinner(field))
  document
    .getElementById(`${row}${col}`)
    .removeEventListener("click", clickOnGrid)
}

function resetButton() {
  resetField()
  setupField()
  document.getElementById("reset-btn").style.visibility = "hidden"
}

function fillField(row, col) {
  if (field[row][col] === null) {
    field[row][col] = player
  }

  switch (player) {
    case "X":
      document.getElementById(row + col).textContent = "X"
      player = "O"
      break
    case "O":
      document.getElementById(row + col).textContent = "O"
      player = "X"
      break
  }
}

function checkFieldState(state) {
  if (state !== null) {
    if (state === "X") {
      document.getElementById("result").textContent = "X is winner"
    } else if (state === "O") {
      document.getElementById("result").textContent = "O is winner"
    } else if (state === "full") {
      document.getElementById("result").textContent = "No one won"
    }
    field = [[null, null, null], [null, null, null], [null, null, null]]
    clearEventListeners()
    document.getElementById("reset-btn").style.visibility = "visible"
  }
}

function clearEventListeners() {
  try {
    for (let row = 0; row <= 2; row++) {
      for (let col = 0; col <= 2; col++) {
        document
          .getElementById(`${row}${col}`)
          .removeEventListener("click", clickOnGrid)
      }
    }
  } catch (ReferenceError) {}
}

function resetField() {
  for (let row = 0; row <= 2; row++) {
    for (let col = 0; col <= 2; col++) {
      document.getElementById(`${row}${col}`).textContent = ""
    }
  }
  document.getElementById("result").textContent = ""
  player = "X"
}
