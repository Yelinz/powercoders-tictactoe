const tictactoe = require("./tictactoe")
const minimax = require("./minimax")
let field = [[null, null, null], [null, null, null], [null, null, null]]
let player = "X"
let score = [0, 0, 0]
let mode = "local"
let difficulty = "hard"
const ws = new WebSocket("ws://localhost:8080")
let online = {
  player: null,
  opponent: null,
  lastMove: null,
  fakeClick: false,
  usedFields: []
}
setupField()

function setupField() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(event) {
      field.forEach((row, r) => {
        row.forEach((_, c) => {
          document
            .getElementById(`${r}${c}`)
            .addEventListener("click", clickOnGrid, { once: true })
        })
      })
      document
        .getElementById("reset-btn")
        .addEventListener("click", resetButton)
      document.getElementById("play-local").addEventListener("click", setMode)
      document.getElementById("play-online").addEventListener("click", setMode)
      document.getElementById("play-bot").addEventListener("click", setMode)
    })
  } else {
    field.forEach((row, r) => {
      row.forEach((_, c) => {
        document
          .getElementById(`${r}${c}`)
          .addEventListener("click", clickOnGrid, { once: true })
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
  } else if (this.dataset.play === "online") {
    clearEventListeners()
    document.getElementById("status").textContent =
      "Waiting on Opponent to Connect"
    document
      .getElementById("disconnect-btn")
      .addEventListener("click", disconnect)
    document.getElementById("disconnect-btn").style.display = "block"
    mode = "online"
    ws.send("play")
  }
}

function clickOnGrid() {
  hideOptions()
  const row = this.parentElement.dataset.row
  const col = this.dataset.col
  fillField(row, col)
  if (mode === "online") {
    if (online["fakeClick"] === false) {
      ws.send(`move,${row}${col},${player}`)
    }
    online["fakeClick"] = false
  }
  checkFieldState(tictactoe.whoIsWinner(field))
  if (mode === "bot" && minimax.availableMoves(field).length !== 9) {
    makeBotMove()
  }
}

function resetButton() {
  window.clearTimeout(timeout)
  resetField()
  if (mode !== "online") {
    setupField()
  }
  document.getElementById("reset-btn").style.display = "none"
}

function fillField(row, col) {
  if (field[row][col] === null) {
    field[row][col] = player
  }
  switch (mode) {
    case "local":
      switch (player) {
        case "X":
          document.getElementById(row + col).textContent = player
          player = "O"
          break
        case "O":
          document.getElementById(row + col).textContent = player
          player = "X"
          break
      }
      break
    case "bot":
      document.getElementById(row + col).textContent = "X"
      break
    case "online":
      switch (online["lastMove"]) {
        case "X":
          document.getElementById(row + col).textContent = "O"
          field[row][col] = "O"
          online["lastMove"] = "O"
          break
        case "O":
          document.getElementById(row + col).textContent = "X"
          field[row][col] = "X"
          online["lastMove"] = "X"
          break
      }
      online["usedFields"].push(row + col)
      if (online["lastMove"] == player) {
        document.getElementById("status").textContent = "Opponents Turn"
        clearEventListeners()
      } else {
        document.getElementById("status").textContent = "Your Turn"
        setupField()
        removeUsedFields()
      }
      break
  }
  if (mode != "online") {
    document.getElementById("status").textContent = `It's ${player}'s Turn`
  }
}

function checkFieldState(state) {
  if (state !== null) {
    let winner
    switch (state) {
      case "X":
        document.getElementById("status").textContent = "X won!"
        winner = "X"
        score[0]++
        break
      case "O":
        document.getElementById("status").textContent = "O won!"
        winner = "O"
        score[2]++
        break
      case "full":
        document.getElementById("status").textContent = "Tied!"
        score[1]++
        break
    }
    field = [[null, null, null], [null, null, null], [null, null, null]]
    clearEventListeners()
    document.getElementById("reset-btn").style.display = "block"
    document.getElementById("score-x").textContent = score[0]
    document.getElementById("score-tied").textContent = score[1]
    document.getElementById("score-o").textContent = score[2]
    if (mode == "online") {
      if (winner == player) {
        document.getElementById("status").textContent = "You won!"
        ws.send("won")
      } else if (winner == online["opponent"]) {
        document.getElementById("status").textContent = "You lost!"
        ws.send("lost")
      } else {
        ws.send("tie")
      }
    }
    window.timeout = window.setTimeout(resetButton, 5000)
  }
}

function clearEventListeners() {
  try {
    field.forEach((row, r) => {
      row.forEach((_, c) => {
        document
          .getElementById(`${r}${c}`)
          .removeEventListener("click", clickOnGrid)
      })
    })
  } catch (ReferenceError) {}
}

function resetField() {
  field.forEach((row, r) => {
    row.forEach((_, c) => {
      document.getElementById(`${r}${c}`).textContent = ""
    })
  })
  if (mode == "online") {
    if (player !== null) {
      document.getElementById("status").textContent =
        online["player"] === 1 ? "Your Turn" : "Opponents Turn"
    }
  } else {
    player = "X"
    document.getElementById("status").textContent = `It's ${player}'s Turn`
  }
}

function hideOptions() {
  document.getElementById("play").style.display = "none"
}

/*
 * vs. Bot Functions
 */

function makeBotMove() {
  const move = minimax.getBotMove(field, difficulty)
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

/*
 * "Online" Functions
 */

ws.onmessage = function(data) {
  if (data.data.includes("found")) {
    if (data.data.includes("p1")) {
      player = "O"
      online["player"] = 2
      online["opponent"] = "X"
      document.getElementById("status").textContent = "Opponents Turn"
    } else if (data.data.includes("p2")) {
      player = "X"
      online["player"] = 1
      online["opponent"] = "O"
      document.getElementById("status").textContent = "Your Turn"
      setupField()
    }
    online["lastMove"] = "O"
  } else if (data.data.includes("move")) {
    let dataArr = data.data.split(",")
    document
      .getElementById(dataArr[1])
      .addEventListener("click", clickOnGrid, { once: true })
    online["fakeClick"] = true
    document.getElementById(dataArr[1]).click()
  } else if (data.data.includes("rematch")) {
    online["usedFields"] = []
    if (data.data.includes("loser")) {
      online["player"] = 2
      online["lastMove"] = player
    } else if (data.data.includes("winner")) {
      online["player"] = 1
      online["lastMove"] = player == "X" ? "O" : "X"
      setupField()
    }
  }
  if (data.data.includes("disconnected")) {
    online = {
      player: null,
      opponent: null,
      lastMove: null,
      fakeClick: false,
      usedFields: []
    }
    field = [[null, null, null], [null, null, null], [null, null, null]]
    clearEventListeners()
    resetField()
    document.getElementById("status").textContent =
      "Opponent Disconnected, searching new one..."
    ws.send("play")
  }
}

ws.onerror = function(error) {
  if (ws.readyState == 3) {
    document.getElementById("play-online").style.display = "none"
  }
}

function removeUsedFields() {
  online["usedFields"].forEach(element => {
    document.getElementById(element).removeEventListener("click", clickOnGrid)
  })
}

function disconnect() {
  ws.close()
  mode = "local"
  resetField()
  clearEventListeners()
  setupField()
  document.getElementById("status").textContent = "Choose Opponent"
  document.getElementById("disconnect-btn").style.display = "none"
  document.getElementById("play").style.display = "flex"
  document.getElementById("play-online").style.display = "none"
}
