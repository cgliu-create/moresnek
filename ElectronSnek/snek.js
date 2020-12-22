var xsize = 20;
var ysize = 20;

function generateRow(index, len) {
    let row = document.createElement("tr");
    for (let val = 0; val < len; val++) {
        let name = "" + index + "," + val;
        let dot = document.createElement("td");
        dot.id = name;
        row.appendChild(dot);
    }
    return row
}
function generateArea(id, x, y){
    let loc = document.getElementById(id);
    let area = document.createElement("table");
    for (let val = 0; val < y; val++) {
        area.appendChild(generateRow(val, x));
    } 
    loc.appendChild(area);
}
function parseY(m){
    let c = m.indexOf(',') //"Y,X" 
    return(m.substring(0, c))
}
function parseX(m){
    let c = m.indexOf(',') //"Y,X" 
    return(m.substring(c+1))
}

var movingLeft = false;
var movingRight = true;
var movingDown = false;
var movingUp = false;

function turnLeft(){
    movingLeft = true; movingRight = movingUp = movingDown = false;
}
function turnRight(){
    movingRight = true; movingLeft = movingUp = movingDown = false;
}
function turnUp(){
    movingUp = true; movingLeft = movingRight = movingDown = false;
}
function turnDown(){
    movingDown = true; movingLeft = movingRight = movingUp = false;
}

var speed = 1;

var snake = ["3,3"];
var food = ["7,7"];

function generatefood(xmax, ymax){
    let y = Math.round(Math.random() * ymax);
    let x = Math.round(Math.random() * xmax);
    food.push(`${y},${x}`);
}

function growSnake(){
    let head = snake[snake.length-1];
    let y = parseInt(parseY(head));
    let x = parseInt(parseX(head));
    if (movingLeft){ x -= speed;}  
    if (movingRight){ x += speed;}  
    if (movingDown){ y += speed;}  
    if (movingUp){ y -= speed;}
    snake.push(`${y},${x}`);
}

function checkBounds(xmax, ymax){
    let head = snake[snake.length-1];
    if (head.indexOf("-")!==-1){ return true; }
    let y = parseInt(parseY(head));
    let x = parseInt(parseX(head));
    if (x >= xmax || y >= ymax) { return true; }
    return false;
}

function checkCollision(){
    let head = snake[snake.length-1];
    let body = snake.slice(0, snake.length-1);
    for (const coord of body) {
        if(head === coord){ return true;}
    }
    return false;
}

function drawSnake(){
    let index = 1;
    for (const coord of snake) {
        document.getElementById(coord).style.backgroundColor = "green";
        if (index == snake.length){
            if (movingLeft){ document.getElementById(coord).innerHTML = "←"; }
            if (movingRight){ document.getElementById(coord).innerHTML = "→"; }
            if (movingUp){ document.getElementById(coord).innerHTML = "↑"; }
            if (movingDown){ document.getElementById(coord).innerHTML = "↓"; }
        }
        index += 1;
    }
}
function drawFood(){
    for (const coord of food) {
        document.getElementById(coord).style.backgroundColor = "red";
        document.getElementById(coord).innerHTML = "";
    }
}
function clear(){
    for (let dot of document.getElementsByTagName("td")){  
        dot.style.backgroundColor = "Transparent";
    }
}

var alive = true;

function animate(){
    if (alive){
        if (food.length == 0){ generatefood(xsize-1, ysize-1);}
        let head = snake[snake.length-1];
        let fooditem = food[0];
        growSnake();
        if (head == fooditem){ food.pop();
        } else { snake.shift(); }
        if (checkBounds(xsize, ysize) || checkCollision()){
            alive = false;  
            alert("dead");
        } else {
            clear();
            drawFood();
            drawSnake();
        }
    }
}

function reset(){
    snake = ["3,3"];
    food = ["7,7"];
    movingLeft = false;
    movingRight = true;
    movingDown = false;
    movingUp = false;
    alive = true;
}

document.addEventListener("DOMContentLoaded", () => {
    generateArea("root", xsize, ysize);
    setInterval(animate, 400);
});

document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowLeft") {
        turnLeft();
    }
    if (event.code === "ArrowRight") {
        turnRight();
    }
    if (event.code === "ArrowDown") {
        turnDown();
    }
    if (event.code === "ArrowUp") {
        turnUp();
    }
    if (event.code === "Space") {
        reset();
    }
});
