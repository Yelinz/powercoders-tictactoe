const tictactoe = require("./tictactoe")
let cache = {}
let work

function getBotMove(board, difficulty) {
  const start = Date.now()
  work = 0
  const result = _getBotMove(board, true, difficulty)
  console.log("cache size", Object.keys(cache).length)
  console.log("work", work)
  console.log("Time:", Date.now() - start, "ms")
  return result
}

/**
 * Returns the next move of the Bot.
 */
function _getBotMove(board, maximize, diff, recursion = 0) {
  const player = maximize ? "O" : "X"
  const key = board.toString() + player
  let moveScores = {}

  if (cache[key] && recursion !== 0) {
    return cache[key]
  }

  work++

  for (let move of availableMoves(board)) {
    let newBoard = copy(board)
    ;(newBoard = tictactoe.fillMove(newBoard, move, player)), "test"
    if (assignMoveScore(newBoard) !== false) {
      moveScores[move] = assignMoveScore(newBoard)
    } else {
      moveScores[move] = _getBotMove(newBoard, !maximize, diff, recursion + 1)
    }
  }

  let compare = maximize ? Math.max : Math.min

  //log(board, recursion, moveScores)

  if (recursion === 0) {
    return minmax(
      moveScores,
      availableMoves(board).length >= 6 ? difficulty(diff, maximize) : maximize
    )
  }

  const result = compare(...Object.values(moveScores))
  cache[key] = result
  return result
}

/**
 * Returns empty spots of the board.
 */
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

function copy(board) {
  return board.map(row => row.slice())
}

function log(board, recursion, object) {
  const indent = "\t".repeat(recursion)
  console.log(indent, board[0])
  console.log(indent, board[1])
  console.log(indent, board[2])
  console.log(indent, "moveScores:", object)
  console.log(" ")
}

function minmax(moveScores, maximize) {
  let compare = maximize ? (a, b) => a > b : (a, b) => a < b
  let bestScoredMove = ["33", maximize ? -100 : 100]
  Object.entries(moveScores).forEach(scoreSet => {
    if (compare(scoreSet[1], bestScoredMove[1]) && scoreSet[1] !== false) {
      bestScoredMove = scoreSet
    }
  })
  return bestScoredMove[0]
}

function difficulty(option, maximize) {
  chance = Math.floor(Math.random() * 10)
  if (option === "true") {
    return !maximize
  } else if (option === "false") {
    console.log(chance)
    if (chance > 6) {
      return !maximize
    }
  }
  return maximize
}

let memoize = func => {
  const Cache = {}
  return (...args) => {
    const key = JSON.stringify(args)
    //console.log("cache", Cache)
    return key in Cache ? Cache[key] : (Cache[key] = func(...args))
  }
}

module.exports = {
  getBotMove,
  availableMoves,
  assignMoveScore,
  copy,
  memoize,
  minmax
}
