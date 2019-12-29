import './style.css';

let canvas = document.getElementById('board')! as HTMLCanvasElement;
let ctx = canvas.getContext('2d')!;

let frames = 0;

const sprite = new Image();
sprite.src = './images/sprite.png';

// background
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

//foreground

const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: canvas.height - 112,

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
      this.h
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
      this.h
    );
  }
};

const flapper = {
  animation: [
    {
      sX: 276,
      sY: 112
    },
    {
      sX: 276,
      sY: 139
    },
    {
      sX: 276,
      sY: 164
    },
    {
      sX: 276,
      sY: 139
    }
  ],
  x: 50,
  y: 150,
  w: 34,
  h: 26,

  frame: 0,

  draw: function() {
    const bird = this.animation[this.frame];

    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.w,
      this.h
    );
  }
};

// ready message

const getReady = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: canvas.width / 2 - 173 / 2,
  y: 80,

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
      this.h
    );
  }
};

// game over
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: canvas.width / 2 - 225 / 2,
  y: 90,

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
      this.h
    );
  }
};
function drawGame() {
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bg.draw();
  fg.draw();
  flapper.draw();
  getReady.draw();
}

function updateGame() {}

function animatePerSecond() {
  updateGame();
  drawGame();

  frames++;

  requestAnimationFrame(animatePerSecond);
}

animatePerSecond();
