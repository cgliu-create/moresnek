/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'

function parseY(m){
  let c = m.indexOf(',') //"Y,X" 
  return(m.substring(0, c))
}
function parseX(m){
  let c = m.indexOf(',') //"Y,X" 
  return(m.substring(c+1))
}

class App extends Component {
  state = {
    movingLeft: false, movingRight: true, movingDown: false, movingUp: false,
    speed: 1, alive: true, 
    snake: ["1,1"], food: ["7,7"], squares: {},
    moo: true,
  };
  turnLeft = () => {
    this.setState({ movingLeft: true, movingRight: false, movingDown: false, movingUp: false, });
  }
  turnRight = () => {
    this.setState({ movingLeft: false, movingRight: true, movingDown: false, movingUp: false, });
  }
  turnUp = () => {
    this.setState({ movingLeft: false, movingRight: false, movingDown: false, movingUp: true, });
  }
  turnDown = () => {
    this.setState({ movingLeft: false, movingRight: false, movingDown: true, movingUp: false, });
  }
  generatefood = () => {
    let y = Math.round(Math.random() * (10 - 1));
    let x = Math.round(Math.random() * (10 - 1));
    this.state.food.push(`${y},${x}`);
  }
  growSnake = () => {
    let head = this.state.snake[this.state.snake.length-1];
    let y = parseInt(parseY(head));
    let x = parseInt(parseX(head));
    if (this.state.movingLeft){ x -= this.state.speed; }  
    if (this.state.movingRight){ x += this.state.speed; }  
    if (this.state.movingDown){ y += this.state.speed; }  
    if (this.state.movingUp){ y -= this.state.speed; }
    this.state.snake.push(`${y},${x}`);
  }
  checkBounds = () => {
    let head = this.state.snake[this.state.snake.length-1];
    if (head.indexOf("-")!==-1){ this.setState({ alive: false }); }
    let y = parseInt(parseY(head));
    let x = parseInt(parseX(head));
    if (x >= 10|| y >= 10) { this.setState({ alive: false }); }
  }
  checkCollision(){
    let head = this.state.snake[this.state.snake.length-1];
    let body = this.state.snake.slice(0, this.state.snake.length-1);
    for (let part of body) {
      if(head === part){ this.setState({ alive: false }); }
    }
  }
  draw = () => {
    for (let a in this.state.squares){
      this.state.squares[a] = 0;
    }
    for (let c of this.state.food){
      this.state.squares[c] = 2;
    }
    for (let b of this.state.snake){
      this.state.squares[b] = 1;
    }
    this.setState({ moo: !this.state.moo });
  }
  animate = () => {
    if (this.state.alive){
      if (this.state.food.length === 0){ this.generatefood();}
      let head = this.state.snake[this.state.snake.length-1];
      this.growSnake();
      if (head === this.state.food[0]){ this.state.food.pop();
      } else { this.state.snake.shift(); }
      this.checkBounds();        
      this.checkCollision();
      if (this.state.alive){
        this.draw();
      } else {
        alert("dead");
      }
    }
  }
  componentDidMount = () => {
    this.animate()
    setInterval(() => this.animate(), 400)
  }
  reset = () => {
    this.setState({
      movingLeft: false, movingRight: true, movingDown: false, movingUp: false,
      speed: 1, alive: true, 
      snake: ["1,1"], food: ["7,7"],
    });
  }
  renderSquare(name) {
    return (
      <View key={name}  style={ this.state.squares[name]==0 ? styles.cellb : this.state.squares[name]==1 ? styles.cellg : styles.cellr}></View>
    );
  }
  renderRow(index, length) {
    let rows = [];
    for (let val = 0; val < length; val++) {
      let name = "" + index + "," + val;
      if (!(name in this.state.squares)){
        this.state.squares[name] = 0;
      }
      rows.push(this.renderSquare(name))
    }
    return (
      <View key={index} style={styles.cellrow}>{rows}</View>
    );
  }
  renderArea(){
    let cols = [];
    for (let val = 0; val < 10; val++) {
      cols.push(this.renderRow(val, 10))
    }
    return (
      <View style={styles.container}>{cols}</View>
    );
  } 
  render() {
    return (
      <View style={styles.vstack}>
          <View style={styles.center}>
            <View style={styles.box}>
              {this.renderArea()}
            </View>
          </View>
          <View style={styles.center}>
            <View style={styles.hstack}>
              <View style={styles.center}>
                <TouchableOpacity style={styles.button} onPress={this.turnLeft}>
                  <Text>←</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.vstack}>
                <TouchableOpacity style={styles.button} onPress={this.turnUp}>
                  <Text>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.turnDown}>
                  <Text>↓</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.center}>
                <TouchableOpacity style={styles.button} onPress={this.turnRight}>
                  <Text>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.center}>
              <TouchableOpacity style={styles.button} onPress={this.reset}>
                <Text>Reset</Text>
              </TouchableOpacity> 
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box:{
    width: 400,
    height: 400,
    padding: 10,
  },
  cellrow: {
    flex: 1, 
    alignSelf: 'stretch', 
    flexDirection: 'row',
  },
  cellb: {
    flex: 1, 
    alignSelf: 'stretch',
    margin: 1,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  cellr: {
    flex: 1, 
    alignSelf: 'stretch',
    margin: 1,
    borderRadius: 10,
    backgroundColor: 'red',
  },
  cellg: {
    flex: 1, 
    alignSelf: 'stretch',
    margin: 1,
    borderRadius: 10,
    backgroundColor: 'green',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center', 
  },
  hstack:{
    flexDirection: 'row',
  },
  vstack:{
    flexDirection: 'column',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 20,
    margin: 5,
    zIndex: 1,
  }
})

export default App;
