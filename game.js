const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')

const SPEED_BLINK = 1

let aux = 0
let speed = 0.5
let screenGameOver = false
let auxBlink = 0


let fps = setInterval(show, 100/speed) 


function show() {
    update()
    draw()
}

function update() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    snake.move()
    eatFruit()
    checkHitWall()
}

function updateSpeed(speed) {
    clearInterval(fps)
    fps = setInterval(show, 100/speed)
}

function eatFruit() {
    if(snake.tail[snake.tail.length - 1].x == fruit.x &&
        snake.tail[snake.tail.length - 1].y == fruit.y){
            snake.tail[snake.tail.length] = {x:fruit.x, y: fruit.y}
            fruit = new Fruit()
            speed = speed + 0.1
            updateSpeed(speed)
        }else{
            checkHitItself()
        }
}

function eatPear() {
    if(snake.tail[snake.tail.length - 1].x == pear.x &&
        snake.tail[snake.tail.length - 1].y == pear.y){
            snake.tail[snake.tail.length] = {x:pear.x, y: pear.y}
            pear = new Pear();
            speed = speed + 0.2
            updateSpeed(speed)
        }else{
            checkHitItself()
        }
}

function checkHitWall() {
    let headTail = snake.tail[snake.tail.length -1]

    if (headTail.x == - snake.size) {
        headTail.x = canvas.width - snake.size
    } else if (headTail.x == canvas.width) {
        headTail.x = 0
    } else if (headTail.y == - snake.size) {
        headTail.y = canvas.height - snake.size
    } else if (headTail.y == canvas.height) {
        headTail.y = 0 
    }
}

function checkHitItself() {
    let headTail = snake.tail[snake.tail.length -1]
    let tail = snake.tail.slice(0, snake.tail.length -1)

    for (let i = 0; i < tail.length; i++) {
        if (headTail.x == tail[i].x && headTail.y == tail[i].y) {
            screenGameOver = true
            updateSpeed(SPEED_BLINK)
        }
    }

}

function draw() {

    let score = snake.tail.length - 1
    let record = localStorage.getItem("record")


    if (record == null) {
        localStorage.setItem("record", score)
    }else if (score - 1 > record) {
        localStorage.setItem("record", score)
    }

    if (screenGameOver) {
        createRect(0,0,canvas.width, canvas.height, "black")
        createRect(0,0, canvas.width, canvas.height)

        canvasContext.font = "20px Arial"
        canvasContext.fillStyle =  auxBlink ? "#00FF42" : "red"
        auxBlink = auxBlink ? 0 : 1
        canvasContext.fillText("Game Over",canvas.width/2 - 50, canvas.height/3)
        canvasContext.fillText("Press Enter to restart",canvas.width/2 - 100, canvas.height/3 + 30)
        canvasContext.fillText("Score: " + (snake.tail.length - 1),canvas.width/2 - 40, canvas.height/3 + 60)
        if (score - 1 > record) {
            canvasContext.fillText("New Record!", canvas.width/2 - 55, canvas.height/3 + 90)
        } 
        // update scrore id score in html
    }else{
        createRect(0,0,canvas.width, canvas.height, "black")
        createRect(0,0, canvas.width, canvas.height)
    
        for (let i = 0; i < snake.tail.length; i++){
            createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5,
                snake.size - 5, snake.size- 5, "white")
        }
    
        canvasContext.font = "20px Arial"
        canvasContext.fillStyle = "#00FF42"
        canvasContext.fillText("Score: " + (snake.tail.length -1),canvas.width - 120, 18)
        canvasContext.fillText("Record: " + record,canvas.width - 120, 38)
        createRect(fruit.x, fruit.y, fruit.size, fruit.size, fruit.color)

        // update scrore id score in html
    }




}

function createRect(x,y,width, height,color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

window.addEventListener("keydown", (event) => {
    setTimeout(() => {
        if (event.keyCode == 37 && snake.rotateX != 1) {
            snake.rotateX = -1
            snake.rotateY = 0
        } else if (event.keyCode == 38 && snake.rotateY != 1) {
            snake.rotateX = 0
            snake.rotateY = -1
        } else if (event.keyCode == 39 && snake.rotateX != -1) {
            snake.rotateX = 1
            snake.rotateY = 0
        } else if (event.keyCode == 40 && snake.rotateY != -1) {
            snake.rotateX = 0
            snake.rotateY = 1
        }

        if (event.keyCode == 13 && screenGameOver) {
            screenGameOver = false
            snake.tail = [{x: 0, y: 0}]
            fruit = new Fruit()
            speed = 0.5
            updateSpeed(speed)
        }
    }, 1)
})

class Snake {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{x:this.x, y:this.y}]
        this.rotateX = 0
        this.rotateY = 1
    }

    move() {
        let newRect

        if (this.rotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.rotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)
    }
}





class Fruit {
    constructor(){
        let isTouching
        let color = Math.floor(Math.random() * 3)
        
        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
            
            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }

            this.size = snake.size
            this.color =  color == 0 ? "red" : color == 1 ? "yellow" : "blue"

            if (!isTouching) {
                break;
            }
        }
    }
}


const snake = new Snake(20,20,20);


let fruit = new Fruit();    
