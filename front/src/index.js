import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios'
// Square is a controlled component by Board
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }
  renderSquare(i) {
    return <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
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
