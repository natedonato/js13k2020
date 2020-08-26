const SCALE = 1;
const WIDTH = 106;
const HEIGHT = 132;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 2, 3, 4,0, 1, 2, 3, 4, 5,6,5,6,5,6,7,7,7];
const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 0;
const FRAME_LIMIT = 12;
const FRAME_LIMIT_STANDING = 20;
const MOVEMENT_SPEED = 1.6;

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let keyPresses = {};
let currentDirection = FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;
let positionX = 0;
let positionY = 0;
let img = new Image();

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

function loadImage() {
//   img.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
  img.src = './spritetest.png';
  img.onload = function() {
    window.requestAnimationFrame(gameLoop);
  };
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.save();
    let right = 1;

    if(currentDirection === FACING_LEFT){
        ctx.scale(-1, 1);
        right = -1
    }

  ctx.drawImage(img,
                frameX * WIDTH, 0 * HEIGHT, WIDTH , HEIGHT,
                right === 1 ? canvasX : -canvasX, canvasY, SCALED_WIDTH * right, SCALED_HEIGHT);


    ctx.restore();
}

loadImage();

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let hasMoved = false;

  if (keyPresses.w) {
    moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
    hasMoved = true;
  } else if (keyPresses.s) {
    moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
    hasMoved = true;
  }

  if (keyPresses.a) {
    moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
    hasMoved = true;
  } else if (keyPresses.d) {
    moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
    hasMoved = true;
  }

  if (hasMoved) {
    frameCount++;
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0;
      currentLoopIndex++;
      if (currentLoopIndex >= 5) {
        currentLoopIndex = 0;
      }
    }
  }
  
  if (!hasMoved) {
      console.log(currentLoopIndex);
    if(!(currentLoopIndex === 11 || currentLoopIndex === 12)){currentLoopIndex = 11; console.log('hey')}
    
    frameCount++;
    if (frameCount >= FRAME_LIMIT_STANDING) {
        frameCount = 0;
        currentLoopIndex++;

        if (currentLoopIndex > 12) {
          currentLoopIndex = 11;
        }
      }


  }

  drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
  window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY, direction) {
  if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
    positionX += deltaX;
  }
  if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
    positionY += deltaY;
  }
  currentDirection = direction;
}