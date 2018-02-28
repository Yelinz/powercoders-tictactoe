const tictactoe = require("./tictactoe")
const minimax = require("./minimax")
let field = [[null, null, null], [null, null, null], [null, null, null]]
let player = "X"
let score = [0, 0, 0]
let mode = "local"
let timeout
let difficulty = null
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
      document.getElementById("play-local").addEventListener("click", setMode)
      document.getElementById("play-bot").addEventListener("click", setMode)
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

function setMode() {
  hideOptions()
  if (this.dataset.play === "bot") {
    document.getElementById("status").textContent = "Choose Bot Difficulty"
    difficultyOptions()
    mode = "bot"
  }
}

function clickOnGrid() {
  hideOptions()
  const row = this.parentElement.dataset.row
  const col = this.dataset.col
  fillField(row, col)
  document
    .getElementById(`${row}${col}`)
    .removeEventListener("click", clickOnGrid)
  checkFieldState(tictactoe.whoIsWinner(field))
  if (mode === "bot" && minimax.availableMoves(field).length !== 9) {
    makeBotMove()
  }
}

function resetButton() {
  window.clearTimeout(timeout)
  resetField()
  setupField()
  document.getElementById("reset-btn").style.display = "none"
}

function fillField(row, col) {
  if (field[row][col] === null) {
    field[row][col] = player
  }
  if (mode == "local") {
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
  } else if (mode == "bot") {
    document.getElementById(row + col).textContent = "X"
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
    timeout = window.setTimeout(resetButton, 5000)
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

function hideOptions() {
  document.getElementById("play").style.display = "none"
}

function makeBotMove() {
  const move = minimax.getBotMove(field, difficulty).toString()
  const row = move.split("")[0]
  const col = move.split("")[1]
  if (field[row][col] === null) {
    field[row][col] = "O"
    document.getElementById(move).textContent = "O"
    document.getElementById(move).removeEventListener("click", clickOnGrid)
    checkFieldState(tictactoe.whoIsWinner(field))
  }
}

function difficultyOptions() {
  document.getElementById("easy").addEventListener("click", assignDifficulty)
  document.getElementById("medium").addEventListener("click", assignDifficulty)
  document.getElementById("hard").addEventListener("click", assignDifficulty)
  document.getElementById("difficulty").style.display = "flex"
}

function assignDifficulty() {
  document.getElementById("difficulty").style.display = "none"
  difficulty = this.dataset.diff
  document.getElementById("status").textContent = `It's ${player}'s Turn`
}
