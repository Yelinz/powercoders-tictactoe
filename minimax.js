const tictactoe = require("./tictactoe")

function availableMoves(board) {
  let moves = []
  board.forEach((row, i) => {
    row.forEach((_, j) => {
      if (board[i][j] === null) {
        moves.push(`${i}${j}`)
      }
    })
  })
  return moves
}

/**
 * Returns the value of a game which is finished, or false if it isn't.
 */
function assignMoveScore(board) {
  let value

  if (tictactoe.whoIsWinner(board) === null) {
    value = false
  } else if (tictactoe.whoIsWinner(board) === "O") {
    value = 10
  } else if (tictactoe.whoIsWinner(board) === "X") {
    value = -10
  } else if (tictactoe.whoIsWinner(board) === "full") {
    value = 0
  }
  return value
}

/**
 * Returns the next move of the Bot.
 */
function getBotMove(board, maximize) {
  let moveScore = {}
  for (let move of availableMoves(board)) {
    let newBoard = copy(board)
    const player = maximize ? "O" : "X"
    newBoard[move.split("")[0]][move.split("")[1]] = player
    if (assignMoveScore(newBoard) !== false) {
      moveScore[move] = assignMoveScore(newBoard)
    } else {
      getBotMove(newBoard, !maximize)
    }
  }
  return maximize ? max(moveScore) : min(moveScore)
}

function copy(board) {
  return board.map(row => row.slice())
}

function log(board) {
  console.log(board[0])
  console.log(board[1])
  console.log(board[2])
}

function max(moveScores) {
  let bestScoredMove = ["11", -100]
  Object.entries(moveScores).forEach(scoreSet => {
    if (scoreSet[1] > bestScoredMove[1] && scoreSet[1] !== false) {
      bestScoredMove = scoreSet
    }
  })
  return bestScoredMove[0]
}

function min(moveScores) {
  let worstScoredMove = ["11", 100]
  Object.entries(moveScores).forEach(scoreSet => {
    if (scoreSet[1] < worstScoredMove[1] && scoreSet[1] !== false) {
      worstScoredMove = scoreSet
    }
  })
  return worstScoredMove[0]
}

module.exports = {
  getBotMove,
  assignMoveScore,
  availableMoves,
  copy
}
