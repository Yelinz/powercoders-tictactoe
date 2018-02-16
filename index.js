const tictactoe = require("./tictactoe")
const minimax = require("./minimax")
let field = [[null, null, null], [null, null, null], [null, null, null]]
let player = "X"
let score = [0, 0, 0]
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
      document.getElementById("reset-btn").style.display = "none"
    })
  } else {
    field.forEach((row, i) => {
      row.forEach((_, j) => {
        document
          .getElementById(`${i}${j}`)
          .addEventListener("click", clickOnGrid)
      })
    })
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
  document.getElementById("reset-btn").style.display = "none"
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
  document.getElementById("status").textContent = `It's ${player}'s Turn`
}

function checkFieldState(state) {
  if (state !== null) {
    if (state === "X") {
      document.getElementById("status").textContent = "X won!"
      score[0]++
    } else if (state === "O") {
      document.getElementById("status").textContent = "O won!"
      score[2]++
    } else if (state === "full") {
      document.getElementById("status").textContent = "Tied!"
      score[1]++
    }
    field = [[null, null, null], [null, null, null], [null, null, null]]
    clearEventListeners()
    document.getElementById("reset-btn").style.display = "block"
    document.getElementById("score-x").textContent = score[0]
    document.getElementById("score-tied").textContent = score[1]
    document.getElementById("score-o").textContent = score[2]
  }
}

function clearEventListeners() {
  try {
    field.forEach((row, i) => {
      row.forEach((_, j) => {
        document
          .getElementById(`${i}${j}`)
          .removeEventListener("click", clickOnGrid)
      })
    })
  } catch (ReferenceError) {}
  setTimeout(resetButton, 5000)
}

function resetField() {
  field.forEach((row, i) => {
    row.forEach((_, j) => {
      document.getElementById(`${i}${j}`).textContent = ""
    })
  })
  player = "X"
  document.getElementById("status").textContent = `It's ${player}'s Turn`
}
