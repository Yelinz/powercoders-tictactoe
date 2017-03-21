function removeDuplicates(arr) {
  result = [];
  for (var i = 0; i < arr.length; i++) {
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

/* modern/clever way to write removeDuplicates
function removeDuplicates2(arr) {
  return [...new Set(arr)];
}
*/

function allTheSame(arr) {
  return removeDuplicates(arr).length <= 1;
}

function checkRows(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (allTheSame(arr[i])) {
      return arr[i][0];
    }
  }
}

function transpose(arr) {
  var newArray = arr[0].map(function(col, i) {
    return arr.map(function(row) {
      return row[i];
    });
  });
  return newArray;
}

function checkDiagonals(arr) {
  // this is the "obvious" implementation, there are other ways!
  if (allTheSame([arr[0][0], arr[1][1], arr[2][2]])) {
    return arr[0][0];
  }

  if (allTheSame([arr[0][2], arr[1][1], arr[2][0]])) {
    return arr[0][2];
  }
}

function check(arr) {
  // check rows
  var maybeWinner = checkRows(arr);
  if (maybeWinner) {
    return maybeWinner;
  }

  // check columns
  maybeWinner = checkRows(transpose(arr));
  if (maybeWinner) {
    return maybeWinner;
  }

  // check diagonals
  return checkDiagonals(arr);
}

function format(winner) {
  if (winner) {
    return "Player " + winner + " won!";
  }
  return "Game over, but no winner!";
}

module.exports = {
  removeDuplicates,
  allTheSame,
  check,
  format
};
