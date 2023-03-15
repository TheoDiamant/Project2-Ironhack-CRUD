class FallingElement extends Shape {
  static points = 0;

  constructor(canvas, { img, isObstacle }, naruto) {
    const initialPosition = {
      x: Math.floor(Math.random() * (canvas.width - img.width)),
      y: -img.height,
    };

    super(canvas, { img }, initialPosition);

    this.x = initialPosition.x;
    this.y = initialPosition.y;
    this.width = img.width;
    this.height = img.height;
    this.naruto = naruto;

    const reRender = () => {
      this.ctx.clearRect(this.x, this.y, this.width, this.height);

      this.y += 2;

      this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
    };

    //checking collision
    const checkCollision = (naruto) => {
      const narutoXRight = naruto.x + naruto.width;
      const narutoYBottom = naruto.y + naruto.height;
      const fallingElementXRight = this.x + this.width;
      const fallingElementYBottom = this.y + this.height;

      const overlapX =
        (naruto.x <= fallingElementXRight && naruto.x >= this.x) ||
        (narutoXRight <= fallingElementXRight && narutoXRight >= this.x);
      const overlapY =
        (naruto.y <= fallingElementYBottom && naruto.y >= this.y) ||
        (narutoYBottom <= fallingElementYBottom && narutoYBottom >= this.y);

      const isColliding = overlapX && overlapY;

      //adding collision and collision audio
      if (isColliding) {
        if (isObstacle) {
          window.endGame();
          clearInterval(interval);
          document.querySelector('canvas').style.display = 'none';
          document.querySelector('#game-over').style.display = 'flex';

          GameAudio.stopStartGameSound();
          GameAudio.playGameOverSound();

          const totalPoints = document.querySelector('#points');
          totalPoints.innerHTML = FallingElement.points;

          // Save the score if it's greater than 0
    if (FallingElement.points > 0) {
      Score.saveScore(FallingElement.points);
    }

        } else {
          clearInterval(interval);

          GameAudio.playEatingSound();
          FallingElement.points++;
          this.ctx.clearRect(0, 0, canvas.width, canvas.height);
          this.ctx.clearRect(canvas.width - 200, 80, 300, 60);
        }
      }
    };

    //adding score
    const interval = setInterval(() => {
      reRender();
      checkCollision(this.naruto);

      this.ctx.font = '36px Rowdies';
      this.ctx.fillStyle = '#e14f35';
      this.ctx.fillText(
        `Ramen: ${FallingElement.points}`,
        canvas.width - 200,
        50,
      );

      if (this.y === canvas.height + this.height) {
        clearInterval(interval);
      }
    }, 10);
  }

}

let scoreSent = false;
const Score = {
  saveScore: function (score, game) {
    if (!scoreSent) {
      fetch("http://localhost:3000/scores", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score, game: "Naruto" }),
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
};



module.exports = Score