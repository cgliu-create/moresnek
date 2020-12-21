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

function coordinate(x, y){		
    this.x = x;		
    this.y = y;		
}		
var snake = [new coordinate(3, 3)];
var food = [new coordinate(7, 7)];

function generatefood(){
     let y = Math.round(Math.random() * 10);
     let x = Math.round(Math.random() * 10);
     food.push(new coordinate(x, y));
}

function growSnake(){
     let head = snake[snake.length-1];
     let y = head.y;
     let x = head.x;
     if (movingLeft){ x -= speed;}  
     if (movingRight){ x += speed;}  
     if (movingDown){ y += speed;}  
     if (movingUp){ y -= speed;}
     snake.push(new coordinate(x, y));
}

function checkBounds(){
     let head = snake[snake.length-1];
     return (head.y > 14 || head.y < 0 || head.x > 14 || head.x < 0);
}

function checkCollision(){
    let head = snake[snake.length-1];
    let body = snake.slice(0, snake.length-1);
    for (const coord of body) {
        if(head.x == coord.x && head.y == coord.y){ return true;}
    }
    return false;
}

const letternum = {
    0: "a",1: "b",2: "c",3: "d",4: "e",5: "f",6: "g",7: "h",8: "i",9: "j",10: "k",11: "l",12: "m",13: "n",14: "o"
};

function drawSnake(){
    let dots = document.getElementsByClassName("head");
    for (let dot of dots){  
        dot.className = ""; 
        dot.innerHTML = "";
    }
    let index = 1;
    for (const coord of snake) {
        let id = `#${letternum[coord.y]}${letternum[coord.x]}`;
        document.querySelector(id).style.backgroundColor = "green";
        if (index == snake.length){
            document.querySelector(id).className = "head";
            if (movingLeft){
                document.querySelector(id).innerHTML = "←";
            }
            if (movingRight){
                document.querySelector(id).innerHTML = "→";
            }
            if (movingUp){
                document.querySelector(id).innerHTML = "↑";
            }
            if (movingDown){
                document.querySelector(id).innerHTML = "↓";
            }
        }
        index += 1;
    }
}
function drawFood(){
    for (const coord of food) {
        let id = `#${letternum[coord.y]}${letternum[coord.x]}`;
        document.querySelector(id).style.backgroundColor = "red";
    }
}
function clear(){
    document.querySelectorAll("td").forEach(function(td){
        td.style.backgroundColor = "Transparent";
    });
}

var alive = true;

function animate(){
    if (alive){
        if (food.length == 0){ generatefood();}
        let head = snake[snake.length-1];
        let fooditem = food[0];
        if (head.x == fooditem.x && head.y == fooditem.y){ 
            growSnake();
            food.pop();
        } else {
            growSnake();
            snake.shift();
        }
        if (checkBounds() || checkCollision()){
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
    snake = [new coordinate(3, 3)];
    food = [new coordinate(7, 7)];
    movingLeft = false;
    movingRight = true;
    movingDown = false;
    movingUp = false;
    alive = true;
}

document.addEventListener("DOMContentLoaded", () => {
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