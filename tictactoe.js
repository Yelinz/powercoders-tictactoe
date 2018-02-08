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

function whoIsWinner(arr) {
  const tl = arr[0][0]
  const tr = arr[0][2]
  const m = arr[1][1]
  const bl = arr[2][0]
  const br = arr[2][2]

  for (let i = 0; i <= 2; i++) {
    if (allTheSame(arr[i]) == true && arr[i][0] != null) {
      return arr[i][0]
    }
    /*    if (allTheSame([arr[0][i],arr[1][i],arr[2][i]]) == true && arr[0][i] != null) {
      return arr[0][i]
    }*/
  }

  let rotatedArr = rotateArray(arr)
  for (let i = 0; i <= 2; i++) {
    if (allTheSame(rotatedArr[i]) == true && rotatedArr[i][0] != null) {
      return rotatedArr[i][0]
    }
  }

  if (allTheSame([tl, m, br]) == true || allTheSame([tr, m, bl]) == true) {
    return m
  }
  return null
}

function rotateArray(arr) {
  let returnArr = [[], [], []]
  for (let i = 0; i <= arr.length - 1; i++) {
    for (let j = 0; j <= arr[i].length - 1; j++) {
      returnArr[i].push(arr[j][i])
    }
  }
  return returnArr
}

module.exports = {
  shout,
  sayHello,
  shoutHello,
  removeDuplicates,
  allTheSame,
  whoIsWinner,
  rotateArray
}
