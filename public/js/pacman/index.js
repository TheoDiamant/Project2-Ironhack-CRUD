document.getElementById("play").addEventListener('click', (event) => {


const myGameArea = {
  canvas: document.createElement("canvas"),
  components: [],
  obstacleComponents: [],
  yellowDots: [],
  cornerBonus: [],
  enemy1: [],
  enemy2: [],
  enemy3: [],
  isGameOver : false,
  isGamePaused: false,
  isWinner: false,
  start: function () {
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d")
    const gameBoard = document.getElementById("game-board");
    gameBoard.appendChild(this.canvas);
  },
  update: function () {
    const ctx = myGameArea.context
    ctx.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height)

    if (!myGameArea.isGameOver) {

    myGameArea.obstacleComponents.forEach((e) => {
      e.render()
    })

    document.getElementById("main-menu").style.display = "none"
   

    myGameArea.cornerBonus.forEach((e) => {
      if (e.checkCollision(pacman)) {

        function getColor() {
          return Math.floor(Math.random() * 16777215).toString(16);
        }

        let colorInterval = setInterval(() => {
          pacman.color = `#${getColor()}`;
        }, 20)

        setInterval(() => {
          clearInterval(colorInterval)
          return pacman.color = "red"
        }, 4000)

        let indexBonus = myGameArea.cornerBonus.indexOf(e)
        myGameArea.cornerBonus.splice(indexBonus, 1)
       
      }
      e.render()
    })

    if(myGameArea.yellowDots.length <= 0 && myGameArea.cornerBonus.length <= 0){
      enemy.speed = 0
        enemy2.speed = 0
        enemy3.speed = 0
    myGameArea.isWinner = true
    ctx.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height)
    document.getElementById("winner").style.display = "flex"
  }

    //////INDEXOF FIND THE DOTS THAT HAS BEEN EATEN AND SPLICE REMOVE IT
    myGameArea.yellowDots.forEach((e) => {
      if (e.checkCollision(pacman)) {
       if(enemy.speed < 3 && myGameArea.yellowDots.length < 100){
          enemy.speed += 0.1
        } 
        if(enemy2.speed < 1.5 && myGameArea.yellowDots.length < 80){
          enemy2.speed += 0.1
        } 
        if(enemy3.speed < 1.5 && myGameArea.yellowDots.length < 40){
          enemy3.speed += 0.1
        } 
    
        score += 1;
        postData(score);

        let indexDots = myGameArea.yellowDots.indexOf(e)
        myGameArea.yellowDots.splice(indexDots, 1)
      
    }
      e.render()
    })

    myGameArea.components.forEach((e) => {
      e.render()
    })

    myGameArea.enemy1.forEach((e) => {
        
        if(e.checkCollision(pacman)){
          let deathSong = new Audio()
          deathSong.src = "/song/pacman-song/Death.mp3"
          deathSong.play()

          myGameArea.isGameOver = true
          ctx.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height)
          document.getElementById("game-over").style.display = "flex"
      }
        e.move()
        e.render()

    })

    myGameArea.enemy2.forEach((e) => {
      if(e.checkCollision(pacman)){
         let deathSong = new Audio()
          deathSong.src = "/song/pacman-song/Death.mp3"
        deathSong.play()
        myGameArea.isGameOver = true
        ctx.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height)
        document.getElementById("game-over").style.display = "flex"
    }
       e.move()
       e.render()
 
     })
    } else {
      ctx.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height)
  }

  let collisionDetection = myGameArea.obstacleComponents.forEach(e => {
    pacman.checkCollision(e)
  })
    //////////LINEAR MOVEMENT FOR THE PLAYER//////////////////
    if (playerMovesDown) {
      pacman.y += pacman.speed;
      if (pacman.y >= myGameArea.canvas.height - pacman.h) {
          pacman.y -= pacman.speed
      }
    } else if (playerMovesUp) {
       pacman.y -= pacman.speed;
      
       if (pacman.y < 0 ) {
        pacman.y += pacman.speed
    }
    } else if (playerMovesLeft) {
      pacman.x -= pacman.speed;
      
      if (pacman.x < 0 ) {
        pacman.x += pacman.speed
    }

    } else if (playerMovesRight) {
      pacman.x += pacman.speed;
      if (pacman.x >= myGameArea.canvas.width - pacman.w ) {
        pacman.x -= pacman.speed
    }

    }

    myGameArea.context.font = "20px Verdana";
    myGameArea.context.fillStyle = "yellow";
    myGameArea.context.fillText(
      `Score: ${score}`,
      myGameArea.canvas.width / 10,
      40
    );

  }
}

class Component {
  constructor(x, y, w, h, color) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
  }

  render() {
    const ctx = myGameArea.context

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);

  }

  checkCollision(otherComponent) {
    if (
      this.x < otherComponent.x + otherComponent.w &&
      this.x + this.w > otherComponent.x &&
      this.y < otherComponent.y + otherComponent.h &&
      this.y + this.h > otherComponent.y
    ) {
      return true
    } else {
      return false;
    }
  }
}


// CLASS OF PACMAN AND MOVEMENT OF PACMAN
class Pacman extends Component {
  constructor(x, y, w, h, color, img) {
    super(x, y, w, h, color)
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.img = new Image()
    this.img.src = "/images/pacman-images/pacman1.png"
    this.color = "red"
    this.speed = 0;
  }

  render() {
    const ctx = myGameArea.context
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

  }

  moveLeft() {

    this.x -= 10

    if (this.x < 0 || pacman.checkCollision(square1) || pacman.checkCollision(square2)
      || pacman.checkCollision(square3) || pacman.checkCollision(square4)) {
      this.x += 10
    }
  }


  moveRight() {

    this.x += 10

    if (this.x >= myGameArea.canvas.width - this.w || pacman.checkCollision(square1) || pacman.checkCollision(square2)
      || pacman.checkCollision(square3) || pacman.checkCollision(square4)) {
      this.x -= 10
    }
  }

  moveUp() {

    this.y -= 10;

    if (this.y < 0 || pacman.checkCollision(square1) || pacman.checkCollision(square2)
      || pacman.checkCollision(square3) || pacman.checkCollision(square4)) {
      this.y += 10
    }

  }
  moveDown() {

    this.y += 10

    if (this.y >= myGameArea.canvas.height - this.h || pacman.checkCollision(square1) || pacman.checkCollision(square2)
      || pacman.checkCollision(square3) || pacman.checkCollision(square4)) {
      this.y -= 10
    }
  }
}
//////////:CREATION DU PAC MAN ////////////
let pacman = new Pacman(225, 225, 50, 50)
myGameArea.components.push(pacman)

class Enemy1 { 
  constructor(x, y, w, h, color, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color
    this.speed = 1
    this.img = new Image()
    this.img.src = "/images/pacman-images/enemy1.png"
    this.directions = ["up", "right", "down", "left"];
    this.currentDirectionIndex = 0
    this.position = [
      {x: 0, y: 0}, // top left
      {x: 250, y: 0}, // middle top
      {x: 500, y: 0}, // top right
      {x: 0, y: 250}, // middle left
      {x: 250, y: 250}, // middle
      {x: 500, y: 250}, // middle right
      {x: 0, y: 500}, // bottom left
      {x: 250, y: 500}, // bottom middle
      {x: 500, y: 500} // bottom right
    ]
  }

  render() {
    const ctx = myGameArea.context
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

  }

  setDirection(direction) {
    this.currentDirectionIndex = this.directions.indexOf(direction);
   // const randomIndex = Math.floor(Math.random() * this.position.length)
    // const randomPosition = this.position[randomIndex]
    // this.x = randomPosition.x
    // this.y = randomPosition.y
  }

  move() {
    if (this.directions[this.currentDirectionIndex] === "up") {
      this.y -= this.speed;
      if (this.y < 6) {
        this.setDirection("right")
      }
    } else if (this.directions[this.currentDirectionIndex] === "down") {
      this.y += this.speed;

      if (this.y >= myGameArea.canvas.height - this.h - 6) {
        this.setDirection("left");
      }
    } else if (this.directions[this.currentDirectionIndex] === "left") {
      this.x -= this.speed;
      if (this.x < 6) {
       this.setDirection("up")
      }
    } else if (this.directions[this.currentDirectionIndex] === "right") {
      this.x += this.speed;
      if (this.x >= myGameArea.canvas.width - this.w - 6 ) {
        this.setDirection("down");
      }
    }
  }

  checkCollision(otherComponent) {
    if (
      this.x < otherComponent.x + otherComponent.w &&
      this.x + this.w > otherComponent.x &&
      this.y < otherComponent.y + otherComponent.h &&
      this.y + this.h > otherComponent.y
    ) {
      return true
    } else {
      return false;
    }
  }

}

const enemy = new Enemy1(6, 6, 50, 50, "pink")
myGameArea.enemy1.push(enemy)

class Enemy2 { 
  constructor(x, y, w, h, color, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color
    this.speed = 1
    this.img = new Image()
    this.img.src = "/images/pacman-images/enemy2.png"
    this.directions = ["up", "right", "down", "left"];
    this.currentDirectionIndex = 0
    this.position = [
      {x: 0, y: 0}, // top left
      {x: 250, y: 0}, // middle top
      {x: 500, y: 0}, // top right
      {x: 0, y: 250}, // middle left
      {x: 250, y: 250}, // middle
      {x: 500, y: 250}, // middle right
      {x: 0, y: 500}, // bottom left
      {x: 250, y: 500}, // bottom middle
      {x: 500, y: 500} // bottom right
    ]
  }

  render() {
    const ctx = myGameArea.context
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

  }

  setDirection(direction) {
    this.currentDirectionIndex = this.directions.indexOf(direction);
   // const randomIndex = Math.floor(Math.random() * this.position.length)
    // const randomPosition = this.position[randomIndex]
    // this.x = randomPosition.x
    // this.y = randomPosition.y
  }

  move() {
    if (this.directions[this.currentDirectionIndex] === "up") {
      this.y -= this.speed;
      if (this.y < 6) {
        this.setDirection("down")
      }
    } else if (this.directions[this.currentDirectionIndex] === "down") {
      this.y += this.speed;

      if (this.y >= myGameArea.canvas.height - this.h - 6) {
        this.setDirection("up");
      }
    }
  }

  checkCollision(otherComponent) {
    if (
      this.x < otherComponent.x + otherComponent.w &&
      this.x + this.w > otherComponent.x &&
      this.y < otherComponent.y + otherComponent.h &&
      this.y + this.h > otherComponent.y
    ) {
      return true
    } else {
      return false;
    }
  }

}

const enemy2 = new Enemy2(225, 5, 50, 50, "blue")
myGameArea.enemy2.push(enemy2)

class Enemy3 { 
  constructor(x, y, w, h, color, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color
    this.speed = 1
    this.img = new Image()
    this.img.src = "/images/pacman-images/enemy3.png"
    this.directions = ["right", "left"];
    this.currentDirectionIndex = 0
    this.position = [
      {x: 0, y: 0}, // top left
      {x: 250, y: 0}, // middle top
      {x: 500, y: 0}, // top right
      {x: 0, y: 250}, // middle left
      {x: 250, y: 250}, // middle
      {x: 500, y: 250}, // middle right
      {x: 0, y: 500}, // bottom left
      {x: 250, y: 500}, // bottom middle
      {x: 500, y: 500} // bottom right
    ]
  }

  render() {
    const ctx = myGameArea.context
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);

  }

  setDirection(direction) {
    this.currentDirectionIndex = this.directions.indexOf(direction);
   // const randomIndex = Math.floor(Math.random() * this.position.length)
    // const randomPosition = this.position[randomIndex]
    // this.x = randomPosition.x
    // this.y = randomPosition.y
  }

   move() {
    if (this.directions[this.currentDirectionIndex] === "right") {
      this.x += this.speed;
      if (this.x >= myGameArea.canvas.width - this.w - 6 ) {
        this.setDirection("left");
      }
    } else if (this.directions[this.currentDirectionIndex] === "left") {
      this.x -= this.speed;
      if (this.x < 6) {
       this.setDirection("right")
      }
    } else if (this.directions[this.currentDirectionIndex] === "right") {
      this.x += this.speed;
    
    }
  }

  checkCollision(otherComponent) {
    if (
      this.x < otherComponent.x + otherComponent.w &&
      this.x + this.w > otherComponent.x &&
      this.y < otherComponent.y + otherComponent.h &&
      this.y + this.h > otherComponent.y
    ) {
      return true
    } else {
      return false;
    }
  }

}

const enemy3 = new Enemy3(440, 225, 50, 50, "purple")
myGameArea.enemy2.push(enemy3)


// CLASS des carrés sur la map
class Square extends Component {
  constructor(x, y, w, h, color) {
    super(x, y, w, h, color)
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = "blue"
  }
  render(){
    const ctx = myGameArea.context
    ctx.lineWidth = 5
    ctx.strokeStyle = this.color;

    ctx.strokeRect(this.x, this.y, this.w, this.h);

  }
}


// Création des carrés sur la map, apres création je les push dans l'array (Components)
// Grace a une boucle forEach et la method Render, je display les carré sur la map dans update
let square1 = new Square(60, 60, 160, 160)
myGameArea.obstacleComponents.push(square1)
let square2 = new Square(60, 280, 160, 160)
myGameArea.obstacleComponents.push(square2)
let square3 = new Square(280, 60, 160, 160)
myGameArea.obstacleComponents.push(square3)
let square4 = new Square(280, 280, 160, 160)
myGameArea.obstacleComponents.push(square4)




// CLASS des POINTS JAUNES sur la map
class Dot extends Component {
  constructor(x, y, w, h, color, radius) {
    super(x, y, w, h, color)
    this.x = x
    this.y = y
    this.radius = 4
    this.color = "yellow"
  }

  render(){
    const ctx = myGameArea.context
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; // !
    ctx.fill();
    ctx.closePath();
  }
}

/////////// START THE SET UP OF THE DOT ON THE MAP/////////////////////
let upX = 0
for (let i = 0; i < 20; i++) {
  upX += 22.4
  myGameArea.yellowDots.push(new Dot(upX, 30, 8, 8))
}

let leftY = 10
for (let i = 0; i < 21; i++) {
  leftY += 21.3
  myGameArea.yellowDots.push(new Dot(24, leftY, 8, 8))
}

let downX = 0
for (let i = 0; i < 20; i++) {
  downX += 22.4
  myGameArea.yellowDots.push(new Dot(downX, 465, 8, 8))
}

let rightY = 8
for (let i = 0; i < 21; i++) {
  rightY += 21.7
  myGameArea.yellowDots.push(new Dot(470, rightY, 8, 8))
}

let middleX = 1
for (let i = 0; i < 21; i++) {
  middleX += 22
  myGameArea.yellowDots.push(new Dot(middleX, 246, 8, 8))
}

let middleY = 8
for (let i = 0; i < 20; i++) {
  middleY += 21.7
  myGameArea.yellowDots.push(new Dot(246.5, middleY, 8, 8))
}



class CornerDot extends Component {
  constructor(x, y, w, h, color, radius) {
    super(x, y, w, h, color)
    this.x = x
    this.y = y
    this.radius = 12
    this.color = "yellow"
  }

  render(){
    const ctx = myGameArea.context
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white'; // !
    ctx.fill();
    ctx.closePath();
  }
}


let cornerTopleft = new CornerDot(25, 30, 30, 30)
myGameArea.cornerBonus.push(cornerTopleft)
let cornerTopRight = new CornerDot(470, 30, 30, 30)
myGameArea.cornerBonus.push(cornerTopRight)
let cornerBottomleft = new CornerDot(20, 460, 30, 30)
myGameArea.cornerBonus.push(cornerBottomleft)
let cornerBottomRight = new CornerDot(468, 466, 30, 30)
myGameArea.cornerBonus.push(cornerBottomRight)

/////////// END OF THE SET UP OF THE DOT ON THE MAP/////////////////////



//////////////LINEARY MOVEMENT//////////////////

let playerMovesDown = false;
let playerMovesUp = false;
let playerMovesLeft = false;
let playerMovesRight = false;


////////////ARROW MOVEMENT ON KEYBOARD////////////////
document.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
    case "ArrowLeft":
      playerMovesLeft = true;

      pacman.moveLeft()

      break;
    case 38:
    case "ArrowUp":
      playerMovesUp = true;

      pacman.moveUp()

     
      break;
    case 39:
    case "ArrowRight":
      playerMovesRight = true;

     pacman.moveRight()
      break;
    case 40:
    case "ArrowDown":
      playerMovesDown = true;
    
     pacman.moveDown()

      break;
  }
};




let score = 0

})



// write a function to calculate 2 numbers