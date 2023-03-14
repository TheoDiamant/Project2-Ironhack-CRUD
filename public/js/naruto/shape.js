class Shape {
  constructor(canvas, { img }, initialPosition) {
    this.ctx = canvas.getContext('2d');

    img.onload = () => {
      this.ctx.drawImage(
        img,
        initialPosition.x,
        initialPosition.y,
        img.width,
        img.height,
      );
    };
  }
}
