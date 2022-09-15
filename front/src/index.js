import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios'
// Square is a controlled component by Board
function Square(props) {
    return (
      <button className="square" onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
  }


class Board extends React.Component {
  renderSquare(i) {
    return <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class KindItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  render() {
    return (
      <button className="kind-item" onClick={console.log("kind clicked")}>
        {this.props.name}
      </button>
    );
  }
}
class TopicList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        item: [],
      DataisLoaded: false,
        figure: [],
    };
  }

  render() {
    console.log(this.state);
    const { items } = this.state;
    console.log(items);
        return (
          <div className="shopping-list">
            <h1>AIcon</h1>
            <h2>AIcon generates icons what you want.</h2>
            <li>Choose icon kind</li>
            <ul>
              <KindItem name="animal"/>
              <KindItem name="nature"/>
              <KindItem name="location"/>
            </ul>
            <li>Choose icon color</li>
            <ul>
              <KindItem name="red" />
              <KindItem name="blue" />
              <KindItem name="green" />
            </ul>
            <Game />
            <h3>input something name</h3>
            <EasyForm />

          </div>
        );
    }

  }
class EasyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'cat'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
      fetch('http://localhost:8000/generate', {  // Enter your IP address here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: this.state.value,
      }), // body data type must match "Content-Type" header
    }).then(res => res.json()).then(response => {
      console.log("posted");
      console.log(response);
      this.setState({ DataisLoaded: true, items: response });
    }).catch(error => console.error('Error:', error));
    event.preventDefault();
    // fetch figure
    axios.get(
      'http://localhost:8000/cat',
      { responseType: 'blob', }
    )
      .then(res => {
        this.setState({ figure: res.data })
      });
  }

  render() {
    if (this.state.DataisLoaded) {
      return (
        <div>
          <h1>Generated Icon</h1>
          <ul>
            {this.state.items.item_prompt}
          </ul>
           <img src={this.state.figure} width="500" alt="figure"/>
        </div>
      )
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TopicList />);
// root.render(<Game />);
