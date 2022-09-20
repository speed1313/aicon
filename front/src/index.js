import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios'




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
        image: [],
    };
  }

  render() {
    console.log(this.state);
    const { items } = this.state;
    console.log(items);
        return (
          <div className="shopping-list">
            <h1>AIcon</h1>
            <img src="https://2.bp.blogspot.com/-XIjdkGsG_u8/U82zGlpgNUI/AAAAAAAAjKw/dxsQGmNb7BU/s800/animal_mark03_inu.png" width="100" alt="figure"/>
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
      this.setState({ DataisLoaded: true, items: response.item_prompt, image: response.image });
    }).catch(error => console.error('Error:', error));
    event.preventDefault();
    // fetch figure
    /*
    fetch('http://localhost:8000/cat', {  // Enter your IP address here
      method: 'GET',
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
      }
    }).then(response => response.json()).then(response => {
      console.log(response.image);
      this.setState({ DataisLoaded: true, figure: response.image});
      }).catch(error => console.error('Error:', error));*/
  };

  render() {
    if (this.state.DataisLoaded) {
      return (
        <div>
          <h1>Generated Icon</h1>
          <ul>

          </ul>
          <img src={this.state.image} width="500" alt="figure" />
          <button onClick={() => this.setState({DataisLoaded: false})}>Retry</button>
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
