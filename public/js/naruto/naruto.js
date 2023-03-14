class Naruto extends Shape {
  constructor(canvas, { img }) {
    const initialPosition = {
      x: canvas.width / 2 - img.width / 2,
      y: canvas.height - img.height,
    };

    super(canvas, { img }, initialPosition);

    this.x = initialPosition.x;
    this.y = initialPosition.y;
    this.width = img.width;
    this.height = img.height;

    const xBoundary = canvas.width - this.width;
    const yBoundary = canvas.height - this.height;

    //adding boundaries and mouse movement
    window.addEventListener(
      'mousemove',
      (e) => {
        console.log(e);
        if (e.clientX > xBoundary) {
          this.ctx.clearRect(this.x, this.y, this.width, this.height);

          this.x = xBoundary;

          this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else if (e.clientY > yBoundary) {
          this.ctx.clearRect(this.x, this.y, this.width, this.height);

          this.y = yBoundary;

          this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
          this.ctx.clearRect(this.x, this.y, this.width, this.height);

          this.x = e.clientX;
          this.y = e.clientY;

          this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
      },
      false,
    );
  }
}
