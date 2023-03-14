class GameAudio {
  static startGameSound = new Audio('/song/naruto-song/naruto-start-game.mp3');
  static gameOverSound = new Audio('/song/naruto-song/naruto-game-over.mp3');
  static eatingSound = new Audio('/song/naruto-song/eating.mp3');

  static playStartGameSound() {
    GameAudio.startGameSound.play();
    GameAudio.startGameSound.volume = 0.2;
    GameAudio.startGameSound.setAttribute('loop', '');
  }

  static stopStartGameSound() {
    GameAudio.startGameSound.pause();
    GameAudio.startGameSound.currentTime = 0;
  }

  static playGameOverSound() {
    GameAudio.gameOverSound.play();
  }

  static stopGameOverSound() {
    GameAudio.gameOverSound.pause();
    GameAudio.gameOverSound.currentTime = 0;
  }

  static playEatingSound() {
    GameAudio.eatingSound.currentTime = 0.3;
    GameAudio.eatingSound.play();
  }
}
