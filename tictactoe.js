function shout(str) {
  if (typeof str !== "string") {
    return null
  }
  return str.toUpperCase()
}

function sayHello(person) {
  return `Hello ${person}!`
}

function shoutHello(person) {
  return shout(sayHello(person))
}

function removeDuplicates(arr) {
  return [...new Set(arr)]
}

function allTheSame(arr) {
  return new Set(arr).size <= 1
}

function rowWinner(arr) {
  const winnerRow = arr.find(row => {
    return allTheSame(row) === true && row[0] != null
  })
  return winnerRow ? winnerRow[0] : false
}

function hasEmptyCell(arr) {
  return !!arr.find(row => {
    return row.includes(null)
  })
}

function whoIsWinner(arr) {
  if (rowWinner(arr)) {
    return rowWinner(arr)
  }
  const colWinner = rowWinner(transpose(arr))
  if (colWinner) {
    return colWinner
  }

  const m = arr[1][1]
  if (
    allTheSame([arr[0][0], m, arr[2][2]]) === true ||
    allTheSame([arr[0][2], m, arr[2][0]]) === true
  ) {
    return m
  }

  if (!hasEmptyCell(arr)) {
    return "full"
  }

  return null
}

function transpose(arr) {
  let returnArr = [[], [], []]
  arr.forEach((row, i) => {
    row.forEach((_, j) => {
      returnArr[i].push(arr[j][i])
    })
  })
  return returnArr
}

module.exports = {
  shout,
  sayHello,
  shoutHello,
  removeDuplicates,
  allTheSame,
  whoIsWinner,
  transpose,
  hasEmptyCell
}
