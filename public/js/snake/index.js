const myGameArea = {
  canvas: document.createElement("canvas"),
  components: [], // create general components, player and background
  bonus: [], //   array for bonus that gets filled in
  joker: [], //   array for bonus that gets filled in
  snake: [],
  ateABonus: false,
  isGameOver: false,
  start: function () {
    isGameOver = false;
    let playerMovesDown = false;
    let playerMovesUp = false;
    let playerMovesLeft = false;
    let playerMovesRight = false; // add the variables into the start function so that when we start all functions are back to false
    this.canvas.width = 500;
    this.canvas.height = 300;
    this.context = this.canvas.getContext("2d");
    const gameBoard = document.getElementById("game-board");
    gameBoard.appendChild(this.canvas);
  }, // standard canvas variables
  testInterval() {
    if (score === 0) {
      myGameArea.myInterval = setInterval(
        myGameArea.updateLinearMovement,
        40000 / 60
      );
    } else if (score === 1) {
      clearInterval(myGameArea.myInterval);
      myGameArea.myInterval = setInterval(
        myGameArea.updateLinearMovement,
        20000 / 60
      );
    } else if (score === 5) {
      clearInterval(myGameArea.myInterval);
      myGameArea.myInterval = setInterval(
        myGameArea.updateLinearMovement,
        10000 / 60
      );
    } else if (score === 10) {
      clearInterval(myGameArea.myInterval);
      myGameArea.myInterval = setInterval(
        myGameArea.updateLinearMovement,
        5000 / 60
      );
    }
  },
  updateGame: function () {
    toBeUpdated = true;
    if (toBeUpdated) {
      if (!myGameArea.isGameOver) {
        myGameArea.components.forEach((component) => {
          component.render();
        });
        myGameArea.bonus.forEach((bonus1) => {
          if (bonus1.checkEating(myGameArea.snake[0])) {
            myGameArea.ateABonus = true;
            score += 1; // create bonus give score 1
            myGameArea.testInterval();
            let indexBonus1 = myGameArea.bonus.indexOf(bonus1); //find the index of the bonus from the bonus array
            myGameArea.bonus.splice(indexBonus1, 1); // remove this specific bonus using the index from the array
          }
          bonus1.render(); // if no collision, just render the bonus
        });
        myGameArea.joker.forEach((joker1) => {
          if (joker1.checkEating(myGameArea.snake[0])) {
            bonusToEat += 1; // create bonus give score 2
            let indexJoker1 = myGameArea.joker.indexOf(joker1); //find the index of the bonus from the bonus array
            myGameArea.joker.splice(indexJoker1, 1); // remove this specific bonus using the index from the array
          }
          joker1.render(); // if no collision, just render the joker
        });

        // Snake logic
        // Snake rendering
        myGameArea.snake.forEach((body) => {
          body.render();
        });

        myGameArea.context.font = "20px Verdana";
        myGameArea.context.fillStyle = "black";
        myGameArea.context.fillText(
          `Score: ${score}`,
          myGameArea.canvas.width / 10,
          40
        );

        myGameArea.context.font = "20px Verdana";
        myGameArea.context.fillStyle = "black";
        myGameArea.context.fillText(
          `Bonus: ${bonusToEat}`,
          myGameArea.canvas.width - 160,
          40
        ); // display of score on top left
      } else if (myGameArea.isGameOver) {
        Score.saveScore(score); // active la fonction de sauvegarde du scote (mettre une boolean pour pas que ce soit envoyé 50 fois)
        myGameArea.context.clearRect(
          0,
          0,
          myGameArea.canvas.width,
          myGameArea.canvas.height
        );
        myGameArea.context.fillStyle = "#96d202";
        myGameArea.context.fillRect(
          0,
          0,
          myGameArea.canvas.width,
          myGameArea.canvas.height
        );
        myGameArea.context.textAlign = "center";
        myGameArea.context.fillStyle = "black";
        myGameArea.context.fillText(
          `Game-Over!`,
          myGameArea.canvas.width / 2,
          myGameArea.canvas.height / 2 - 30
        );
        myGameArea.context.fillText(
          `Your score is ${score}`,
          myGameArea.canvas.width / 2,
          myGameArea.canvas.height / 2
        );
        myGameArea.context.fillText(
          `and you got ${bonusToEat} Bonus eaten`,
          myGameArea.canvas.width / 2,
          myGameArea.canvas.height / 2 + 30
        );
      }
    } else {
      toBeUpdated = false;
    }
  },

  updateGameOver: function () {
    for (let i = 1; i < myGameArea.snake.length; i++) {
      if (
        myGameArea.snake[0].x === myGameArea.snake[i].x &&
        myGameArea.snake[0].y === myGameArea.snake[i].y
      ) {
        myGameArea.isGameOver = true;
      }
    }
  },

  updateLinearMovement: function () {
    let newSnakeBody;
    let currentHead = myGameArea.snake[0];

    let newX = currentHead.x;
    let newY = currentHead.y;

    // My own snake movement
    if (myGameArea.playerMovesUp && !myGameArea.playerMovesDown) {
      newY -= 10;
    } else if (myGameArea.playerMovesRight) {
      newX += 10;
    } else if (myGameArea.playerMovesDown) {
      newY += 10;
    } else if (myGameArea.playerMovesLeft) {
      newX -= 10;
    }

    newSnakeBody = new BodySnake(
      newX,
      newY,
      10, //length of the player
      10 // width of the player
    );

    if (
      myGameArea.playerMovesUp ||
      myGameArea.playerMovesRight ||
      myGameArea.playerMovesDown ||
      myGameArea.playerMovesLeft
    ) {
      myGameArea.snake.unshift(newSnakeBody);
      if (myGameArea.ateABonus) {
        myGameArea.ateABonus = false;
      } else {
        myGameArea.snake.pop();
      }
    }

    if (
      myGameArea.playerMovesDown &&
      myGameArea.snake[0].y >= myGameArea.canvas.height
    ) {
      myGameArea.snake[0].y = 0;
    } else if (myGameArea.playerMovesUp && myGameArea.snake[0].y === -10) {
      myGameArea.snake[0].y = myGameArea.canvas.height - 10;
    } else if (myGameArea.playerMovesLeft && myGameArea.snake[0].x === -10) {
      myGameArea.snake[0].x = myGameArea.canvas.width - 10;
    } else if (
      myGameArea.playerMovesRight &&
      myGameArea.snake[0].x >= myGameArea.canvas.width
    ) {
      myGameArea.snake[0].x = 0;
    }
  }, // function to update the movement of the snake and respawn the snake on the other side of the screen
};

class Component {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    if (color) this.color = color;
  }
  // standard class constructor
  render() {
    const ctx = myGameArea.context;
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }
  // render function which render the image when an image is present or render a rectangle when no images
  checkEating(otherComponent) {
    if (
      this.x < otherComponent.x + otherComponent.w &&
      this.x + this.w > otherComponent.x &&
      this.y < otherComponent.y + otherComponent.h &&
      this.y + this.h > otherComponent.y
    ) {
      return true;
    } else {
      return false;
    }
  }
  //   equivalent to checkcollision function
}

// class HeadSnake extends Component {
//   constructor(x, y, w, h, color) {
//     super(x, y, w, h, color);
//     this.color = "black";
//     this.speed = 10;
//   }
// }
class BodySnake extends Component {
  constructor(x, y, w, h, color) {
    super(x, y, w, h, color);
    this.color = "black";
    this.speed = 10;
  }
}
// class TailSnake extends Component {
//   constructor(x, y, w, h, color) {
//     super(x, y, w, h, color);
//     this.color = "black";
//     this.speed = 10;
//   }
// }

class Background extends Component {
  constructor(x, y, w, h, color) {
    super(x, y, w, h, color);
    this.w = w;
    this.h = h;
    this.color = "#96d202";
  }
} // class for background using the standard color of the snake 2

class Bonus extends Component {
  constructor(x, y, w, h, color) {
    super(x, y, w, h, color);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = "yellow";
  } // class for bonuses
}
class Joker extends Component {
  constructor(x, y, w, h, color) {
    super(x, y, w, h, color);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = "#EE82EE";
  } // class for joker
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      if (myGameArea.playerMovesUp) {
      } else {
        myGameArea.playerMovesLeft = false;
        myGameArea.playerMovesRight = false;
        myGameArea.playerMovesUp = false;
        myGameArea.playerMovesDown = true;
      }
      break;
    case "Up": // IE/Edge specific value
    case "ArrowUp":
      if (myGameArea.playerMovesDown) {
      } else {
        myGameArea.playerMovesLeft = false;
        myGameArea.playerMovesRight = false;
        myGameArea.playerMovesUp = true;
        myGameArea.playerMovesDown = false;
      }
      break;
    case "Left": // IE/Edge specific value
    case "ArrowLeft":
      if (myGameArea.playerMovesRight) {
      } else {
        myGameArea.playerMovesLeft = true;
        myGameArea.playerMovesRight = false;
        myGameArea.playerMovesUp = false;
        myGameArea.playerMovesDown = false;
      }
      break;
    case "Right": // IE/Edge specific value
    case "ArrowRight":
      if (myGameArea.playerMovesLeft) {
      } else {
        myGameArea.playerMovesLeft = false;
        myGameArea.playerMovesRight = true;
        myGameArea.playerMovesUp = false;
        myGameArea.playerMovesDown = false;
      }
      break;
    case "Enter":
      // Do something for "enter" or "return" key press.
      break;
    case "Esc": // IE/Edge specific value
    case "Escape":
      // Do something for "esc" key press.
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
});

let background, snakeBody, snakeBody2, snakeBody3, snakeBody4; // creation of the player and background

document.getElementById("start-button").addEventListener("click", (event) => {
  // create an event on the start game button
  myGameArea.start(); // start the game

  background = new Background(
    0,
    0,
    myGameArea.canvas.width,
    myGameArea.canvas.height
  );
  myGameArea.components.push(background);

  snakeBody = new BodySnake(
    myGameArea.canvas.width / 2 - 20, //positions the player in the center width
    myGameArea.canvas.height / 2, //positions the player in the center height
    10, //length of the player
    10 // width of the player
  );
  myGameArea.snake.push(snakeBody); // pushed the player inside the components array (with the background)

  snakeBody2 = new BodySnake(
    myGameArea.canvas.width / 2 - 10, //positions the player in the center width
    myGameArea.canvas.height / 2, //positions the player in the center height
    10, //length of the player
    10 // width of the player
  );
  myGameArea.snake.push(snakeBody2); // pushed the player inside the components array (with the background)

  snakeBody3 = new BodySnake(
    myGameArea.canvas.width / 2, //positions the player in the center width
    myGameArea.canvas.height / 2, //positions the player in the center height
    10, //length of the player
    10 // width of the player
  );
  myGameArea.snake.push(snakeBody3); // pushed the player inside the components array (with the background)

  snakeBody4 = new BodySnake(
    myGameArea.canvas.width / 2 + 10, //positions the player in the center width
    myGameArea.canvas.height / 2, //positions the player in the center height
    10, //length of the player
    10 // width of the player
  );
  myGameArea.snake.push(snakeBody4); // pushed the player inside the components array (with the background)

  snakeBody5 = new BodySnake(
    myGameArea.canvas.width / 2 + 20, //positions the player in the center width
    myGameArea.canvas.height / 2, //positions the player in the center height
    10, //length of the player
    10 // width of the player
  );
  myGameArea.snake.push(snakeBody5); // pushed the player inside the components array (with the background)

  snakeBody6 = new BodySnake(
    myGameArea.canvas.width / 2 + 30, //positions the player in the center width
    myGameArea.canvas.height / 2, //positions the player in the center height
    10, //length of the player
    10 // width of the player
  );
  myGameArea.snake.push(snakeBody6); // pushed the player inside the components array (with the background)

  setInterval(() => {
    let randomXBonus =
      Math.floor((Math.random() * myGameArea.canvas.width - 10) / 10) * 10; // divides by 10 before rounding and multiply by ten so that numbers are rounded to 10s
    let randomYBonus =
      Math.floor((Math.random() * myGameArea.canvas.height - 10) / 10) * 10;

    let anyBonus = new Bonus(randomXBonus, randomYBonus, 10, 10);
    if (
      (anyBonus.x >= 50 && anyBonus.x <= 130) || // create a condition that will check the x and y of the randomBonus to not display it behind score of the player
      (anyBonus.x >= 340 &&
        anyBonus.x <= 420 && // create a condition that will check the x and y of the randomBonus to not display it behind bonus of the player
        anyBonus.y >= 20 &&
        anyBonus.y <= 30)
    ) {
    } else {
      myGameArea.bonus.push(anyBonus);
    }
  }, 4000);
  //   creates the random bonuses using a setinterval of 4000

  setInterval(() => {
    let randomXJoker =
      Math.floor((Math.random() * myGameArea.canvas.width - 10) / 10) * 10;
    let randomYJoker =
      Math.floor((Math.random() * myGameArea.canvas.height - 10) / 10) * 10;

    let anyJoker = new Joker(randomXJoker, randomYJoker, 10, 10);
    if (
      (anyJoker.x >= 50 && anyJoker.x <= 130) || // create a condition that will check the x and y of the randomJoker to not display it behind score of the player
      (anyJoker.x >= 340 &&
        anyJoker.x <= 420 && // create a condition that will check the x and y of the randomJoker to not display it behind bonus of the player
        anyJoker.y >= 20 &&
        anyJoker.y <= 30)
    ) {
    } else {
      myGameArea.joker.push(anyJoker);
    }
  }, 16000); //creates the exact same for jokers and can change the timing of jokers

  if (!myGameArea.isGameOver) {
    setInterval(myGameArea.updateGame, 1000 / 60);
  }
  // frequency of update of the game
  setInterval(myGameArea.updateGameOver, 1000 / 60);
  // frequency of update of the game
});

let score = 0; // score starts at 0
let bonusToEat = 0;

myGameArea.testInterval();

const reloadButton = document.getElementById("reload-button");

let refreshPage = () => {
  location.reload();
};
reloadButton.addEventListener("click", refreshPage);

// création d'une constante our exporter le score. dans cette constante on intègre un objet dont une fonction savescore
// et une méthode post qui va publier le score sous format JSON
// attention bien intégrer l' ctivation de la fonction quand game is over

let scoreSent = false;
const Score = {
  saveScore: function (score) {
    if (score >= 2) {
      if (!scoreSent) {
        fetch("http://localhost:3000/snake", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score }),
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log("Score inserted!:", data);
            // Définition de la variable globale sur true
            scoreSent = true;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  },
};

module.exports = Score;

module.exports = Score;
