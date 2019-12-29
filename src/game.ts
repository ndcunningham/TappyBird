import './style.css';

let canvas = document.getElementById('board')! as HTMLCanvasElement;
let ctx = canvas.getContext('2d')!;

let frames = 0;

const sprite = new Image();
sprite.src = './images/sprite.png';

const POINT = new Audio();
POINT.src = './audio/point.wav';

const HIT = new Audio();
HIT.src = './audio/hit.wav';

const SWOOSH = new Audio();
SWOOSH.src = './audio/swoosh.wav';

const DIE = new Audio();
DIE.src = './audio/die.wav';

const WING = new Audio();
WING.src = './audio/wing.wav';

const state = {
  current: 0,
  ready: 0,
  play: 1,
  over: 2
};

const startBtn = {
  x: 120,
  y: 263,
  w: 83,
  h: 29
};

const DEGREE = Math.PI / 180;

// GAME CONTROL
canvas.addEventListener('click', function(event) {
  switch (state.current) {
    case state.ready:
      state.current = state.play;
      SWOOSH.play();
      break;

    case state.play:
      flapper.flap();
      WING.play();
      break;

    case state.over:
      let canvasRect = canvas.getBoundingClientRect();
      let clickX = event.clientX - canvasRect.left;
      let clickY = event.clientY - canvasRect.top;

      // CHECK if the start button has actually been clicked
      if (
        clickX >= startBtn.x &&
        clickX < startBtn.x + startBtn.w &&
        clickY >= startBtn.y &&
        clickY < startBtn.y + startBtn.h
      ) {
        resetBoard();
        state.current = state.ready;
      }
      break;
  }
});

// background
// #region background
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
// #endregion

//foreground
// #region foreground
const fg = {
  sX: 276,
  sY: 0,
  w: 224,
  h: 112,
  x: 0,
  y: canvas.height - 112,
  dx: 2,

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
  },

  update: function() {
    if (state.current == state.play) {
      this.x = (this.x - this.dx) % (this.w / 2);
    }
  }
};
// #endregion

// #region flapper
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
  period: 0,
  speed: 0,
  gravity: 0.25,
  jump: 4.6,
  rotation: 0,
  radius: 12,

  draw: function() {
    const bird = this.animation[this.frame];

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.drawImage(
      sprite,
      bird.sX,
      bird.sY,
      this.w,
      this.h,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );

    ctx.restore();
  },

  flap: function() {
    this.speed = -this.jump;
  },

  updateFlapper: function() {
    // IF we are on the ready screen the bird should flap slower
    this.period = state.current == state.ready ? 10 : 5;

    // We increment the frame by 1 for each period
    this.frame += frames % this.period == 0 ? 1 : 0;

    // safeguard to only animate over the length of the animations
    this.frame = this.frame % this.animation.length;

    if (state.current == state.ready) {
      this.y = 150; // reset the position of the bird after game over
      this.rotation = 0 * DEGREE;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.y + this.h / 2 >= canvas.height - fg.h) {
        this.y = canvas.height - fg.h - this.h / 2;

        if (state.current == state.play) {
          state.current = state.over;
          DIE.play();
        }
      }

      // If the speed is greater than the jump, the bird is falling
      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  },

  speedReset: function() {
    this.speed = 0;
  }
};
// #endregion

// pipes
// #region pipes

const pipes = {
  position: [],
  top: {
    sX: 553,
    sY: 0
  },

  bottom: {
    sX: 502,
    sY: 0
  },

  w: 53,
  h: 400,
  gap: 85,
  maxYPos: -150,
  dx: 2,

  draw: function() {
    for (let index = 0; index < this.position.length; index++) {
      let p = this.position[index];

      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;

      // top pipe
      ctx.drawImage(
        sprite,
        this.top.sX,
        this.top.sY,
        this.w,
        this.h,
        p.x,
        topYPos,
        this.w,
        this.h
      );

      // bottom pipe
      ctx.drawImage(
        sprite,
        this.bottom.sX,
        this.bottom.sY,
        this.w,
        this.h,
        p.x,
        bottomYPos,
        this.w,
        this.h
      );
    }
  },

  update: function() {
    if (state.current !== state.play) return;

    if (frames % 100 == 0) {
      this.position.push({
        x: canvas.width,
        y: this.maxYPos * (Math.random() + 1)
      });
    }

    for (let index = 0; index < this.position.length; index++) {
      let p = this.position[index];

      let bottomPipeYPos = p.y + this.h + this.gap;

      // Collision detection
      if (
        flapper.x + flapper.radius > p.x &&
        flapper.x - flapper.radius < p.x + this.w &&
        [p.y, bottomPipeYPos].some(
          yPos =>
            flapper.y + flapper.radius > yPos &&
            flapper.y - flapper.radius < yPos + this.h
        )
      ) {
        state.current = state.over;
        HIT.play();
      }

      // Move pipes to the left
      p.x -= this.dx;

      // if the pipes are outside of the canvas, we should remove them
      if (p.x + this.w <= 0) {
        this.position.shift();

        score.value += 1;
        POINT.play();
        score.best = Math.max(score.best, score.value);

        localStorage.setItem('best', `${score.best}`);
      }
    }
  },

  reset: function() {
    this.position = [];
  }
};
// #endregion

// ready message
// #region ready
const ready = {
  sX: 0,
  sY: 228,
  w: 173,
  h: 152,
  x: canvas.width / 2 - 173 / 2,
  y: 80,

  draw: function() {
    if (state.current == state.ready) {
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
  }
};
// #endregion

// game over
// #region over
const gameOver = {
  sX: 175,
  sY: 228,
  w: 225,
  h: 202,
  x: canvas.width / 2 - 225 / 2,
  y: 90,

  draw: function() {
    if (state.current == state.over) {
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
  }
};
// #endregion

// score
// #region score
const score = {
  value: 0,
  best: parseInt(localStorage.getItem('best')) || 0,

  draw: function() {
    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#000';

    if (state.current == state.play) {
      ctx.lineWidth = 2;
      ctx.font = '35px Teko';
      ctx.fillText(this.value, canvas.width / 2, 50);
      ctx.strokeText(this.value, canvas.width / 2, 50);
    } else if (state.current == state.over) {
      // score
      ctx.font = '25px Teko';
      ctx.fillText(this.value, 225, 186);
      ctx.strokeText(this.value, 225, 186);

      // best score
      ctx.fillText(this.best, 225, 228);
      ctx.strokeText(this.best, 225, 228);
    }
  },

  reset: function() {
    this.value = 0;
  }
};
// #endregion

// reset
function resetBoard() {
  pipes.reset();
  flapper.speedReset();
  score.reset();
}
function drawGame() {
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bg.draw();
  pipes.draw();
  fg.draw();
  flapper.draw();
  ready.draw();
  gameOver.draw();
  score.draw();
}

function updateGame() {
  flapper.updateFlapper();
  fg.update();
  pipes.update();
}

function animatePerSecond() {
  updateGame();
  drawGame();

  frames++;

  requestAnimationFrame(animatePerSecond);
}

animatePerSecond();
