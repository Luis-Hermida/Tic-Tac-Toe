import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={
        "square " + (props.winner.includes(props.index) ? "winner" : "")
      }
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={this.props.winner}
        index={i}
      />
    );
  }

  createBoard = () => {
    let board = [];
    let boardIndex = 0;

    for (let i = 0; i < 3; i++) {
      let children = [];
      for (let j = 0; j < 3; j++) {
        children.push(<span key={j}>{this.renderSquare(boardIndex++)}</span>);
      }
      board.push(
        <div className="board-row" key={i}>
          {children}
        </div>
      );
    }
    return board;
  };

  render() {
    return <div>{this.createBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: ""
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      stepsReversed: false,
      winner: []
    };
  }

  getPosition(index) {
    let coordinates = {
      0: "(1-1)",
      1: "(2-1)",
      2: "(3-1)",
      3: "(1-2)",
      4: "(2-2)",
      5: "(3-2)",
      6: "(1-3)",
      7: "(2-3)",
      8: "(3-3)"
    };
    return coordinates[index];
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).role !== null || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([{ squares, position: this.getPosition(i) }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      winner:
        calculateWinner(squares).position !== null
          ? calculateWinner(squares).position
          : []
    });
  }

  jumpTo(step, current) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      winner:
        calculateWinner(current[step].squares).position !== null
          ? calculateWinner(current[step].squares).position
          : []
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner =
      calculateWinner(current.squares).role !== null
        ? calculateWinner(current.squares).role
        : "";

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " " + history[move].position
        : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move, history)}
            className={
              move === this.state.stepNumber
                ? "active-play step-button"
                : "step-button"
            }
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (!current.squares.includes(null)) {
      status = "Tie";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winner={this.state.winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <button
            onClick={() => {
              this.setState({
                stepsReversed: !this.state.stepsReversed
              });
            }}
            className="step-button"
          >
            Toggle Steps Order
          </button>
          <ol>{this.state.stepsReversed ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
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
      let winnerObj = {
        role: squares[a],
        position: [a, b, c]
      };
      return winnerObj;
    }
  }
  let onGoingGameObj = {
    role: null,
    position: null
  };
  return onGoingGameObj;
}

ReactDOM.render(<Game />, document.getElementById("root"));
