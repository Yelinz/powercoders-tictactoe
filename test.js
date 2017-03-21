var test = require("tape");
var tictactoe = require("./tictactoe");

var { removeDuplicates, allTheSame, check, format } = tictactoe;

test("removeDuplicates removes all duplicates from an array", function(t) {
  t.deepEquals(removeDuplicates([1, 2, 3]), [1, 2, 3]);
  t.deepEquals(removeDuplicates([1, 1, "1"]), [1, "1"], "data types matter");

  var actual = removeDuplicates([0, "a", null, undefined, "a", null])
  t.deepEquals(actual, [0, "a", null, undefined]);
  t.deepEquals(removeDuplicates([]), [], "it should work for empty arrays");
  t.end();
});

test("allTheSame checks if all elements in array are the same", function(t) {
  t.equal(allTheSame([1, 1, 1]), true);
  t.equal(allTheSame([2, 2, "2"]), false, "data types matter");
  t.equal(allTheSame([null, undefined]), false,
    "null and undefined are different"
  );
  t.equal(allTheSame([]), true, "returns true for an empty array");
  t.end();
});

test("check function returns the winner", function(t) {
  t.equal(check([
      ["O", "O", "X"],
      ["",  "X",  ""],
      ["",   "",  ""]
  ]), undefined, "returns undefined if there is no winner");
  t.equal(check([
      ["X", "X", "X"],
      ["",  "0", "X"],
      ["",   "", "0"]
  ]), "X", "it finds a winner in the first column");
  t.equal(check([
      ["X", "X", "O"],
      ["",  "X", "O"],
      ["",   "", "O"]
  ]), "O", "it finds a winner in the last row");
  t.equal(check([
      ["X", "X", "O"],
      ["",  "X", "O"],
      ["",   "", "X"]
  ]), "X", "it finds a winner in the first diagonal");
  t.equal(check([
      ["X", "X", "O"],
      ["",  "O", "O"],
      ["O",  "", "X"]
  ]), "O", "it finds a winner in the second diagonal");
  t.end();
});

test("format should show the result of the game", function(t) {
  t.equal(format("X"), "Player X won!");
  t.equal(format("O"), "Player O won!");
  t.equal(format(), "Game over, but no winner!");
  t.end();
});
