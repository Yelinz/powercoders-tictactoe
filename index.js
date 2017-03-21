var $ = require('jquery');
var tictactoe = require('./tictactoe');

var last;
var state;
var winner;

function initializeGame() {
  last = "X";
  state = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  $('td').html('');
}

function isDraw() {
  // if the game board is full, but there is no winner, it is a draw!
  return $("td:empty").length == 0;
}

function cellClicked() {
  var row = $(this).parent().attr('data-row');
  var col = $(this).attr('data-col');

  if (!$(this).text()) {
    if (last === "X") {
      $(this).text('O');
      last = "O";
    } else {
      $(this).text('X');
      last = "X";
    }

    state[row][col] = last;

    winner = tictactoe.check(state);
    if (winner || isDraw()) {
      alert(tictactoe.format(winner));
      initializeGame();
    }
  }
}

$(function() {

  initializeGame();

  $('td').click(cellClicked);
});
