import './style.css';

let canvas = document.getElementById('board') as HTMLCanvasElement;
let ctx = canvas.getContext('2d');

function drawAndUpdate() {}

function animatePerSecond() {
  drawAndUpdate();

  requestAnimationFrame(animatePerSecond);
}

// animatePerSecond();
