//for canvas background(delete if use css picture)
function resizeCanvas() {
  let img = document.getElementById("dynamic_img");
  let width = img.clientWidth;
  let height = img.clientHeight;

  canvas.style.width = width;
  canvas.style.height = height;
}
//until here

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
cornerLevelElem = document.getElementById("level");

let rectX = 600;
let rectY = 650;
let rectLength = 150;
let rectWidth = 20;
function drawRect() {
  ctx.fillStyle = "plum";
  ctx.strokeStyle = "#4B0082";
  ctx.fillRect(rectX, rectY, rectLength, rectWidth);
  ctx.strokeRect(rectX, rectY, rectLength, rectWidth);
}
drawRect();

// fill.Style = "purple";
// ctx.strokeRect(rectX, rectY, rectLength, rectWidth);

ctx.fillRect(600, 650, 150, 20);
const img = new Image();
img.src = "/images/crystal_ball.png";

let heart = new Image();
heart.src = "/images/heart.png";

let currentLevel = 1;
let pauseStartSize = 40;

let hearts = 3;
function drawHearts() {
  for (let i = 0; i < hearts; i++) {
    ctx.drawImage(heart, 10 + 40 * i, 15, 30, 20);
  }
}

function drawStartButton() {
  const startPic = new Image();
  startPic.src = "/images/start4.png";
  startPic.onload = () => {
    ctx.drawImage(
      startPic,
      canvas.width - pauseStartSize - 10,
      10,
      pauseStartSize,
      pauseStartSize
    );
  };
}

function drawPauseButton() {
  const pause = new Image();
  pause.src = "/images/pause.png";
  ctx.drawImage(
    pause,
    canvas.width - pauseStartSize - 10,
    10,
    pauseStartSize,
    pauseStartSize
  );
}

const ball = {
  x: 640,
  y: 580,
  vx: -1,
  vy: -1,
  draw: function () {
    //paint the ball one color
    // ctx.beginPath();
    // ctx.arc(this.x + 35, this.y + 35, 35, 0, Math.PI * 2, true);
    // ctx.closePath();
    // ctx.fillStyle = this.color;
    // ctx.fill();

    //picture ball
    ctx.fillStyle = "plum";
    ctx.drawImage(img, this.x, this.y, 70, 70);
  },

  coordinates: function () {
    const points = [];

    for (let degree = 0; degree < 360; degree++) {
      let radians = (degree * Math.PI) / 180;
      let x = Math.round(this.x + 35 * Math.cos(radians));
      let y = Math.round(this.y + 35 * Math.sin(radians));
      points.push({ x: x, y: y });
    }
    return points;
  },
};

//bricks initiate and draw
const lengthBrick = 120;
const heightBrick = 40;
let leftBricks = [];
let vertical;
let horizontal;

function initiateBricks() {
  leftBricks = [];
  vertical = currentLevel + 2;
  horizontal = currentLevel + 3;
  for (let i = 0; i < vertical; i++) {
    for (let j = 0; j < horizontal; j++) {
      leftBricks.push({ x: (700-(85*horizontal)) + j * 150, y: 50 + i * 50 });
    }
  }
}
initiateBricks();

function drawBricks() {
  for (let i = 0; i < vertical; i++) {
    for (let j = 0; j < horizontal; j++) {
      ctx.fillStyle =
        "rgb(300, " +
        Math.floor(170 - 20 * i) +
        ", " +
        Math.floor(230 - 42.5 * j) +
        ")";
      if (
        leftBricks.some(
          (item) =>
            item.x === (700-(85*horizontal)) + j * 150 && item.y === 50 + i * 50
        )
      ) {
        ctx.fillRect(
          (700-(85*horizontal)) + j * 150,
          50 + i * 50,
          lengthBrick,
          heightBrick
        );
      }
    }
  }
}

  //   leftBricks.forEach((brick, index) => {
  //     ctx.fillRect(brick.x + 300, brick.y + 50, lengthBrick, heightBrick);
  //   });

function updateBricks() {
  const ballCoordinatesArray = ball.coordinates();

  ballCoordinatesArray.forEach((ballCoordinates) => {
    leftBricks.forEach((item, index) => {
      if (
        item.x < ballCoordinates.x &&
        ballCoordinates.x < item.x + lengthBrick &&
        ballCoordinates.y < item.y &&
        ballCoordinates.y > item.y - heightBrick
      ) {
        leftBricks.splice(index, 1);
        ball.vy *= -1;
        ball.vx *= 1;
      }
    });
  });
}

window.onload = () => {
  drawEverything();
  drawStartButton();
};

let gameStarted = false;
let intervalID;

let startBanner = document.getElementById("firstDiv");

function popUp(popUpText) {
  let popUpTextEl = document.getElementById("textStart");
  popUpTextEl.innerHTML = popUpText;
  startBanner.removeAttribute("class", "hidden");
}

document.addEventListener("keyup", (e) => {
  if (e.code === "Space" && !gameStarted) {
    startBanner.setAttribute("class", "hidden");
    intervalID = setInterval(update, 3);
    gameStarted = true;
    drawPauseButton();
  } else if (e.code === "Space" && gameStarted) {
    popUp("Click space to continue!");
    startBanner.removeAttribute("class", "hidden");
    drawStartButton();
    clearInterval(intervalID);
    gameStarted = false;
  }
});

function update() {
  drawEverything();
  drawPauseButton();
  updateBricks();
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y < 0) {
    ball.vy *= -1;
  }
  if (ball.x > canvas.width - 70 || ball.x < 0) {
    ball.vx *= -1;
  }
  if (
    ball.x > rectX &&
    ball.x < rectX + rectLength &&
    ball.y >= 600
  ) {
    ball.vy *= -1;
  }

  if (leftBricks.length === 0) {
    currentLevel += 1;
    popUp(`Level ${currentLevel}!`);
    if (currentLevel === 4) {
      currentLevel = 1;
      hearts = 3;
      popUp("Congratulations, you won the game!");
    }
    newLevel();
  }
  if (ball.y > canvas.height - rectWidth) {
    hearts -= 1;
    popUp("You lost a life. Click space to continue!");
    if (hearts === 0) {
      //lose condition
      currentLevel = 1;
      hearts = 3;
      popUp("Game over! Click space to play again.");
    }
    newLevel();
  }
}

//change level 
function newLevel() {
  clearInterval(intervalID);
  cornerLevelElem.innerHTML = `Level ${currentLevel}`;
  gameStarted = false;
  ball.x = 640;
  ball.y = 580;
  rectX = 600;
  rectY = 650;
  initiateBricks();
  drawEverything();
  drawStartButton();
}

function drawEverything() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  drawHearts();
  drawRect();
  drawBricks();
}

function moveLeft() {
  if (rectX > 0) {
    rectX -= 50;
  }
}
function moveRight() {
  if (rectX < canvas.width - rectLength) {
    rectX += 50;
  }
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      moveLeft();
      break;
    case "ArrowRight":
      moveRight();
      break;
  }
});
