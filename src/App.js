import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    let draw = squares.every(element => element !== null);
    if (draw === true) {
      status = "Draw";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  let squaresBoard = []
  let boards = []
  squares.forEach((square, index) => {
    squaresBoard.push(<Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />)
    if (squaresBoard.length === 3) {
      boards.push(<div key={index} className="board-row">{squaresBoard.map(square => square)}</div>);
      squaresBoard.length = 0;
    }
  })

  return (
    <>
      <div className="status">{status}</div>
      {boards}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [toggleOrder, setToggleOrder] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

/*   function toggleOrder(history) {
    console.log(history)
    setHistory(history.reverse());
  } */

  const lastMove = history.length - 1;
  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    if (move === currentMove && description !== 'Go to game start') {
      if ((move === 1 && toggleOrder === false) || (move === lastMove && toggleOrder)) {
        return (
          <div key={move}>
            <div style={{justifyContent: "center"}}>
              <button onClick={() => setToggleOrder(toggleOrder ? false: true)} style={{fontWeight: "bold"}}>{'SORT ORDER'}</button>
            </div>
            <li>
              <span>{'You are at move #'}{move}</span>
            </li>
          </div>
        );
      }
      return (
        <li key={move}>
          <span>{'You are at move #'}{move}</span>
        </li>
      );
    }
    if ((move === 1 && toggleOrder === false) || (move === lastMove && toggleOrder)) {
      return (
        <div key={move}>
          <div style={{justifyContent: "center"}}>
            <button onClick={() => setToggleOrder(toggleOrder ? false: true)} style={{fontWeight: "bold"}}>{'SORT ORDER'}</button>
          </div>
          <li>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        </div>
      );
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  if (toggleOrder) {
    let start = [moves[0]];
    moves = moves.slice(1).reverse();
    moves = [...start, ...moves];
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
