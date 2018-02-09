var test = require("tape")
var {
  shout,
  sayHello,
  shoutHello,
  removeDuplicates,
  allTheSame,
  whoIsWinner,
  transpose,
  hasEmptyCell
} = require("./tictactoe")

test("shout turns any string into UPPERCASE", function(t) {
  t.equals(shout("hello"), "HELLO", "it should shout HELLO")
  t.equals(shout(), null, "if no string is given, it should return null")
  t.equals(shout(6), null, "if no string is given, it should return null")
  t.end()
})

test("sayHello should say hello the any given person", function(t) {
  t.equals(sayHello("powercoders"), "Hello powercoders!")
  t.equals(sayHello("World"), "Hello World!")
  t.end()
})

test("shoutHello should shout the greeting", function(t) {
  t.equals(shoutHello("powercoders"), "HELLO POWERCODERS!")
  t.equals(shoutHello("World"), "HELLO WORLD!")
  t.end()
})

test("removeDuplicates removes all duplicates from an array", function(t) {
  t.deepEquals(removeDuplicates([1, 2, 3]), [1, 2, 3])
  t.deepEquals(removeDuplicates([1, 1, "1"]), [1, "1"], "data types matter")
  t.deepEquals(removeDuplicates([0, "a", null, undefined, "a", null]), [
    0,
    "a",
    null,
    undefined
  ])
  t.deepEquals(removeDuplicates([]), [])
  t.end()
})

test("allTheSame checks if all elements in array are the same", function(t) {
  t.equal(allTheSame([1, 1, 1]), true)
  t.equal(allTheSame([2, 2, "2"]), false, "data types matter")
  t.equal(
    allTheSame([null, undefined]),
    false,
    "null and undefined are not the same thing"
  )
  t.equal(allTheSame([]), true, "returns true for an empty array")
  t.end()
})

test("whoIsWinner checkes if X or O is the winner", function(t) {
  t.equal(
    whoIsWinner([["X", "X", "X"], [null, "O", "O"], [null, null, null]]),
    "X",
    "X first line winner"
  )
  t.equal(
    whoIsWinner([["O", "X", "O"], [null, "O", null], ["X", "X", "X"]]),
    "X",
    "X horizontal winner"
  )
  t.equal(
    whoIsWinner([[null, "X", null], ["O", "X", null], ["O", "X", null]]),
    "X",
    "X vertical winner"
  )
  t.equal(
    whoIsWinner([["X", null, "O"], ["O", "X", "X"], ["O", "O", "X"]]),
    "X",
    "X diagonal winner"
  )
  t.equal(
    whoIsWinner([[null, null, null], ["O", "O", "O"], ["X", "X", null]]),
    "O",
    "O horizontal winner"
  )
  t.equal(
    whoIsWinner([["X", "O", "O"], ["X", "X", "O"], ["O", "X", "O"]]),
    "O",
    "O vertical winner"
  )
  t.equal(
    whoIsWinner([[null, "X", "O"], ["X", "O", null], ["O", "X", "X"]]),
    "O",
    "O diagonal winner"
  )
  t.equal(
    whoIsWinner([["O", "X", "O"], ["O", "X", "X"], ["X", "O", null]]),
    null,
    "Game not Finished"
  )
  t.equal(
    whoIsWinner([["O", "X", "O"], ["O", "X", "X"], ["X", "O", "X"]]),
    "full",
    "Field filled no winner"
  )
  t.equal(whoIsWinner([[], [], []]), undefined)
  t.end()
})

test("hasEmptyCell", t => {
  t.equal(hasEmptyCell([[1, 2, 3], [1, 2, 3], [1, 2, 3]]), false)
  t.equal(hasEmptyCell([[1, 2, 3], [1, 2, 3], [1, 2, null]]), true)
  t.end()
})

test("rotateArray rotates an given array", function(t) {
  t.deepEquals(transpose([[1, 2, 2], [1, 2, 3], [1, 2, 3]]), [
    [1, 1, 1],
    [2, 2, 2],
    [2, 3, 3]
  ])
  t.end()
})
