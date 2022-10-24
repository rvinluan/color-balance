import { Sprite } from "./sprite.js";

//setup
var w = document.querySelector(".main").offsetWidth;
var h = 300;
var bSize = 30;
var currentPs = [];
var goalPs = [];

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var uc = document.getElementById("ui-canvas");
var uctx = uc.getContext("2d");
uctx.fillRect(0, 0, w, h);

var brushImgs = [
  document.getElementById("brush-sq"),
  document.getElementById("brush-sl"),
  document.getElementById("brush-st"),
  document.getElementById("brush-sp"),
];
var cursorImg = document.getElementById("cursor");
var sprite = new Sprite(document.getElementById("character-sprite"));

c.width = w;
c.height = h;
uc.width = w;
uc.height = h;

//colors
var colors = ["#ffffff", "#3d1591", "#F7C924", "#F96C6C"];
var currentColor = colors[0];

//state
var isMouseDown = false;
var timer = 0;
var timerTick;
var level = 1;

//constants
const movementSpeed = 5;
const maxVelocity = 5;

//player variables
var players = [
  {
    active: true,
    x: 0,
    y: h / 2 - 12,
    vx: 0,
    vy: 0,
    brushImage: brushImgs[0],
    isDrawing: false,
    color: colors[0],
    keyUp: "w",
    keyDown: "s",
    keyLeft: "a",
    keyRight: "d",
    keyButton1: "q", //draw, ok
    keyButton2: "e", //switch color, cancel
    facing: "down",
    isMoving: false,
    bop: "up",
  },
  {
    active: false,
    x: w / 4,
    y: h / 2 - 12,
    vx: 0,
    vy: 0,
    brushImage: brushImgs[1],
    isDrawing: false,
    color: colors[1],
    keyUp: "i",
    keyDown: "k",
    keyLeft: "j",
    keyRight: "l",
    keyButton1: "u", //draw, ok
    keyButton2: "o", //switch color, cancel
    facing: "down",
    isMoving: false,
    bop: "up",
  },
  {
    active: false,
    x: w / 2,
    y: h / 2 - 12,
    vx: 0,
    vy: 0,
    brushImage: brushImgs[2],
    isDrawing: false,
    color: colors[2],
    keyUp: "z",
    keyDown: "x",
    keyLeft: "c",
    keyRight: "v",
    keyButton1: "b", //draw, ok
    keyButton2: "e", //switch color, cancel
    facing: "down",
    isMoving: false,
    bop: "up",
  },
  {
    active: false,
    x: w / 2 + w / 4,
    y: h / 2 - 12,
    vx: 0,
    vy: 0,
    brushImage: brushImgs[3],
    isDrawing: false,
    color: colors[3],
    keyUp: "9",
    keyDown: "0",
    keyLeft: "-",
    keyRight: "=",
    keyButton1: "8", //draw, ok
    keyButton2: "e", //switch color, cancel
    facing: "down",
    isMoving: false,
    bop: "up",
  },
];

function makeColoredBrushImage(imgSrc, color) {
  // console.log(imgSrc);
  var bw = imgSrc.width / 4;
  //create an offscreen canvas
  var offCanvas = document.createElement("CANVAS");
  offCanvas.width = bw;
  offCanvas.height = bw;
  var octx = offCanvas.getContext("2d");
  //draw the brush onto it
  octx.drawImage(imgSrc, 0, 0, bw, bw);
  var imgd = octx.getImageData(0, 0, bw, bw);
  for (var i = 0; i <= imgd.data.length; i += 4) {
    for (var j = 0; j < 4; j++) {
      //if this pixel is not transparent,
      if (imgd.data[i + 3] !== 0) {
        //make it the color of the current color
        imgd.data[i] = hexToDecimal(color, 1);
        imgd.data[i + 1] = hexToDecimal(color, 3);
        imgd.data[i + 2] = hexToDecimal(color, 5);
      }
    }
  }
  //put the altered image back
  octx.putImageData(imgd, 0, 0);
  //save the canvas as image data
  var imgu = offCanvas.toDataURL("image/png");
  //upate the image with this new data
  imgSrc.src = imgu;
}

function tick() {
  timer += .5;
  sprite.bop(players)
  if (timer % 1 == 0) {
    if (timer > 60) {
      clearTimeout(timerTick);
      endGame();
    } else {
      document.querySelector(".time-remaining").innerHTML = 60 - timer + "s";
    }
  }
}

function generateRandomGoals() {
  var g = [];
  for (var i = 0; i < 3; i++) {
    g.push(Math.floor(Math.random() * 92));
  }
  g.sort((a, b) => a - b);
  g.push(92);
  g.unshift(0);
  var goals = [];
  for (var i = 0; i < g.length - 1; i++) {
    goals.push(g[i + 1] - g[i]);
  }
  goals = goals.map((e) => e + 2);

  //set widths of things
  adjustBars("goal", goals);
  return goals;
}

function hexToDecimal(colorString, start) {
  var hex = colorString.substring(start, start + 2);
  return parseInt(hex, 16);
}

function drawCorners() {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, bSize, bSize);
  ctx.fillStyle = colors[1];
  ctx.fillRect(w - bSize, 0, bSize, bSize);
  ctx.fillStyle = colors[2];
  ctx.fillRect(0, h - bSize, bSize, bSize);
  ctx.fillStyle = colors[3];
  ctx.fillRect(w - bSize, h - bSize, bSize, bSize);
}

function drawQuadrants() {
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, w / 2, h / 2);
  ctx.fillStyle = colors[1];
  ctx.fillRect(w / 2, 0, w / 2, h / 2);
  ctx.fillStyle = colors[2];
  ctx.fillRect(0, h / 2, w / 2, h / 2);
  ctx.fillStyle = colors[3];
  ctx.fillRect(w / 2, h / 2, w / 2, h / 2);
}

function brush(x, y) {
  var bs = bSize;
  ctx.fillStyle = currentColor;
  // ctx.beginPath();
  // ctx.arc(x, y, 25, 0, Math.PI*2);
  // ctx.fill();
  ctx.save();
  ctx.translate(x, y);
  for (var i = 0; i < 500; i++) {
    ctx.fillRect(
      Math.floor(Math.random() * bs) - bs / 2,
      Math.floor(Math.random() * bs) - bs / 2,
      1,
      1
    );
  }
  ctx.restore();
}

function squareBrush(x, y) {
  var bs = bSize;
  ctx.fillStyle = currentColor;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillRect(-bs / 2, -bs / 2, bs, bs);
  ctx.restore();
}

function imageBrush(x, y, brushImg, color) {
  var bs = brushImg.width;
  ctx.fillStyle = color;
  ctx.save();
  ctx.translate(x, y);
  ctx.drawImage(brushImg, -bs / 2, -bs / 2, bs, bs);
  ctx.restore();
  console.log(brushImg);
}

function checkPercentage() {
  var reds = colors.map((c) => hexToDecimal(c, 1));
  var counts = [0, 0, 0, 0];
  var imgd = ctx.getImageData(0, 0, w, h);
  for (var i = 0; i <= imgd.data.length; i += 4) {
    for (var j = 0; j < 4; j++) {
      if (imgd.data[i] == reds[j]) {
        counts[j]++;
      }
    }
  }
  currentPs = counts.map((x) => (x / (w * h)) * 100);
  adjustBars("current", currentPs);
}

function adjustBars(which, amountsArray) {
  for (var i = 0; i < amountsArray.length; i++) {
    var cn = "." + which + " .indicator" + (i + 1);
    document.querySelector(cn).style.width = amountsArray[i] + "%";
  }
}

function checkForWin() {
  var allWithin = true;
  var offBy = 0;
  for (var i = 0; i < 4; i++) {
    var tolerance = 5;
    let diff = Math.abs(currentPs[i] - goalPs[i]);
    offBy += diff;
    if (diff > tolerance) {
      allWithin = false;
    }
  }
  if (allWithin) {
    console.log("off by: " + offBy);
    matchAnimation();
    levelUp();
    goalPs = generateRandomGoals();
  }
}

function levelUp() {
  console.log(level);
  console.log("level up");
  document.querySelector(".level").innerHTML = ++level;
}

function matchAnimation() {
  var wm = document.querySelector(".win-message");
  var ms = document.querySelector(".match-screen");
  wm.classList.remove("hidden");
  wm.innerHTML = "Match!";
  // ms.classList.add("up");
  setTimeout(function (e) {
    wm.classList.add("hidden");
  }, 1000);
  // setTimeout(function (e) {
  //   ms.classList.remove("up");
  // }, 300)
}

function startGame() {
  for (var i = 0; i < brushImgs.length; i++) {
    makeColoredBrushImage(brushImgs[i], colors[i]);
  }
  document.querySelector(".start-screen").classList.add("hidden");
  // bopTick = setInterval(sprite.bop, 500, players);
  timerTick = setInterval(tick, 500);
  console.log("! - " + sprite.spritePositionToImagePosition(1, 0).x);
  console.log("! - " + sprite.spritePositionToImagePosition(1, 0).y);
}

function endGame() {
  document.querySelector(".end-screen").classList.remove("hidden");
  document.querySelector(".score").innerHTML = level;
  var imgData = c.toDataURL("image/png");
  document.querySelector(".final-image").src = imgData;
}

function handleKeyDown(key, playerObject) {
  switch (key) {
    case playerObject.keyUp:
      playerObject.facing = "up";
      playerObject.vy -= movementSpeed;
      break;
      case playerObject.keyLeft:
      playerObject.facing = "left";
      playerObject.vx -= movementSpeed;
      break;
      case playerObject.keyDown:
        playerObject.facing = "down";
        playerObject.vy += movementSpeed;
        break;
        case playerObject.keyRight:
      playerObject.facing = "right";
      playerObject.vx += movementSpeed;
      break;
    case playerObject.keyButton1:
      playerObject.isDrawing = true;
      break;
  }
}

document.addEventListener("keydown", function (e) {
  for (var i = 0; i < players.length; i++) {
    handleKeyDown(e.key, players[i]);
  }
});

function handleKeyUp(key, playerObject) {
  playerObject.facing = "down";
  playerObject.isMoving = false;
  switch (key) {
    case playerObject.keyUp:
      playerObject.vy = 0;
      break;
    case playerObject.keyLeft:
      playerObject.vx = 0;
      break;
    case playerObject.keyDown:
      playerObject.vy = 0;
      break;
    case playerObject.keyRight:
      playerObject.vx = 0;
      break;
    case playerObject.keyButton1:
      playerObject.isDrawing = false;
      break;
    case "1":
    case "2":
    case "3":
    case "4":
      isMouseDown = false;
      break;
  }
  checkForWin();
}

document.addEventListener("keyup", function (e) {
  for (var i = 0; i < players.length; i++) {
    handleKeyUp(e.key, players[i]);
  }
});

document
  .querySelector(".start-screen .start-4p")
  .addEventListener("click", function (e) {
    players[0].active = true;
    players[1].active = true;
    players[2].active = true;
    players[3].active = true;
    startGame();
  });

ctx.fillStyle = "#2d2d2d";
ctx.fillRect(0, 0, w, h);
// drawCorners();
drawQuadrants();
goalPs = generateRandomGoals();
setInterval(checkPercentage, 300);

function drawPaint() {
  for (var i = 0; i < players.length; i++) {
    if (players[i].isDrawing) {
      imageBrush(
        players[i].x,
        players[i].y,
        players[i].brushImage,
        players[i].color
      );
    }
  }
  requestAnimationFrame(drawPaint);
}

function drawCursors() {
  uctx.clearRect(0, 0, w, h);
  for (var i = 0; i < players.length; i++) {
    if (players[i].active) {
      players[i].vx = Math.min(
        Math.max(players[i].vx, -maxVelocity),
        maxVelocity
      );
      players[i].vy = Math.min(
        Math.max(players[i].vy, -maxVelocity),
        maxVelocity
      );
      players[i].x += players[i].vx;
      players[i].y += players[i].vy;
      uctx.drawImage(cursorImg, players[i].x, players[i].y, 25, 25);
      sprite.drawSprite(uctx, players[i], i);
    }
  }
  requestAnimationFrame(drawCursors);
}


drawPaint();
drawCursors();
