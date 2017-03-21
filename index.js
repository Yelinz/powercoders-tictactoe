var $ = require("jquery");
var tictactoe = require("./tictactoe");

var last;
var state;
var winner;

$(function() {
  initializeGame();

  $("td").click(cellClicked);
});

function initializeGame() {
  last = "X";
  state = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];
  $("td").html("");
}

function cellClicked() {
  var row = $(this).parent().attr("data-row");
  var col = $(this).attr("data-col");

  if (!$(this).text()) {
    last = (last === "X") ? "O" : "X";

    // update UI
    $(this).text(last);

    // update state
    state[row][col] = last;

    // check if game is over
    winner = tictactoe.check(state);
    if (winner || isDraw()) {
      alert(tictactoe.format(winner));
      initializeGame();
    }
  }
}

/**
 * If the game board is full, but there is no winner,
 * it is a draw!
 */
function isDraw() {
  return $("td:empty").length == 0;
}
