import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function parseY(m){
  let c = m.indexOf(',') //"Y,X" 
  return(m.substring(0, c))
}
function parseX(m){
  let c = m.indexOf(',') //"Y,X" 
  return(m.substring(c+1))
}
class Snake extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movingLeft: false, movingRight: true, movingDown: false, movingUp: false,
      speed: 1, alive: true, 
      snake: ["3,3"], food: ["7,7"],
    };
  }
  turnLeft(){
    this.setState({ movingLeft: true, movingRight: false, movingDown: false, movingUp: false, });
  }
  turnRight(){
    this.setState({ movingLeft: false, movingRight: true, movingDown: false, movingUp: false, });
  }
  turnUp(){
    this.setState({ movingLeft: false, movingRight: false, movingDown: false, movingUp: true, });
  }
  turnDown(){
    this.setState({ movingLeft: false, movingRight: false, movingDown: true, movingUp: false, });
  }
  generatefood(){
    let y = Math.round(Math.random() * this.props.y);
    let x = Math.round(Math.random() * this.props.x);
    this.state.food.push(`${y},${x}`);
  }
  growSnake(){
    let head = this.state.snake[this.state.snake.length-1];
    let y = parseInt(parseY(head));
    let x = parseInt(parseX(head));
    if (this.state.movingLeft){ x -= this.state.speed; }  
    if (this.state.movingRight){ x += this.state.speed; }  
    if (this.state.movingDown){ y += this.state.speed; }  
    if (this.state.movingUp){ y -= this.state.speed; }
    this.state.snake.push(`${y},${x}`);
  }
  checkBounds(){
    let head = this.state.snake[this.state.snake.length-1];
    if (head.indexOf("-")!==-1){ this.setState({ alive: false }); }
    let y = parseInt(parseY(head));
    let x = parseInt(parseX(head));
    if (x >= this.props.x || y >= this.props.y) { this.setState({ alive: false }); }
  }
  checkCollision(){
    let head = this.state.snake[this.state.snake.length-1];
    let body = this.state.snake.slice(0, this.state.snake.length-1);
    for (let part of body) {
      if(head === part){ this.setState({ alive: false }); }
    }
  }
  drawSnake(){
    for (let dot of document.getElementsByClassName("head")){  
      dot.className = ""; 
      dot.innerHTML = "";
    }
    let index = 1;
    for (let coord of this.state.snake) {
      document.getElementById(coord).style.backgroundColor = "green";
      if (index === this.state.snake.length){
        document.getElementById(coord).className = "head";
        if (this.state.movingLeft){ document.getElementById(coord).innerHTML = "←"; }
        if (this.state.movingRight){ document.getElementById(coord).innerHTML = "→"; }
        if (this.state.movingUp){ document.getElementById(coord).innerHTML = "↑"; }
        if (this.state.movingDown){ document.getElementById(coord).innerHTML = "↓"; }
      }
      index += 1;
    }
  }
  drawFood(){
    for (let coord of this.state.food) {
      document.getElementById(coord).style.backgroundColor = "red";
    }
  }
  clear(){
    for (let dot of document.getElementsByTagName("td")){  
        dot.style.backgroundColor = "Transparent";
    }
  }
  animate(){
    if (this.state.alive){
      if (this.state.food.length === 0){ this.generatefood();}
      let head = this.state.snake[this.state.snake.length-1];
      this.growSnake();
      if (head === this.state.food[0]){ 
        this.state.food.pop();
      } else {
        this.state.snake.shift();
      }
      this.checkBounds();        
      this.checkCollision();
      if (this.state.alive){
        this.clear();
        this.drawFood();
        this.drawSnake();
      } else {
        alert("dead");
      }
    }
  }
  reset(){
    this.setState({
      movingLeft: false, movingRight: true, movingDown: false, movingUp: false,
      speed: 1, alive: true, 
      snake: ["3,3"], food: ["7,7"],
    });
  }
  handleKeyDown(event) {
    if (event.code === "ArrowLeft") { this.turnLeft(); }
    if (event.code === "ArrowRight") { this.turnRight(); }
    if (event.code === "ArrowDown") { this.turnDown(); }
    if (event.code === "ArrowUp") { this.turnUp(); }
    if (event.code === "Space") { this.reset(); }
  }
  componentDidMount() {
    document.addEventListener("keydown", (event) => { this.handleKeyDown(event); });
    this.animate()
    setInterval(() => this.animate(), 400)
  }
  renderRow(index, length) {
    let rows = [];
    for (let val = 0; val < length; val++) {
      let name = "" + index + "," + val;
      rows.push(<td id={name} key={name}></td>)
    }
    return (
      <tr key={index}>{rows}</tr>
    );
  }
  renderArea(){
    let cols = [];
    for (let val = 0; val < this.props.y; val++) {
      cols.push(this.renderRow(val, this.props.x))
    }
    return (
      <tbody>{cols}</tbody>
    );
  } 
  render() { 
    return (
      <table>{this.renderArea()}</table>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Snake x={20} y={20}></Snake>
  </React.StrictMode>,
  document.getElementById('root')
);
