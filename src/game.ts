import './style.css';

let canvas = document.getElementById('board')! as HTMLCanvasElement;
let ctx = canvas.getContext('2d')!;

let frames = 0;

const sprite = new Image();
sprite.src = './images/sprite.png';

const bg = {
  sX: 0,
  sY: 0,
  w: 275,
  h: 226,
  x: 0,
  y: canvas.height - 226,

  draw: function() {
    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x,
      this.y,
      this.w,
      this.y
    );

    ctx.drawImage(
      sprite,
      this.sX,
      this.sY,
      this.w,
      this.h,
      this.x + this.w,
      this.y,
      this.w,
      this.y
    );
  }
};

function drawGame() {
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bg.draw();
}

function updateGame() {}

function animatePerSecond() {
  updateGame();
  drawGame();

  frames++;

  requestAnimationFrame(animatePerSecond);
}

animatePerSecond();
