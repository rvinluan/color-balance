const startingPositions = [
  (w, h) => ({ x: 0, y: h / 2 - 12 }),
  (w, h) => ({ x: w / 4, y: h / 2 - 12 }),
  (w, h) => ({ x: w / 2, y: h / 2 - 12 }),
  (w, h) => ({ x: w / 2 + w / 4, y: h / 2 - 12 }),
];

const keyButtons = [
  {
    keyUp: "w",
    keyDown: "s",
    keyLeft: "a",
    keyRight: "d",
    keyButton1: "q", //draw, ok
    keyButton2: "e", //switch color, cancel
  },
  {
    keyUp: "i",
    keyDown: "k",
    keyLeft: "j",
    keyRight: "l",
    keyButton1: "u", //draw, ok
    keyButton2: "o", //switch color, cancel
  },
  {
    keyUp: "z",
    keyDown: "x",
    keyLeft: "c",
    keyRight: "v",
    keyButton1: "b", //draw, ok
    keyButton2: "e", //switch color, cancel
  },
  {
    keyUp: "9",
    keyDown: "0",
    keyLeft: "-",
    keyRight: "=",
    keyButton1: "8", //draw, ok
    keyButton2: "e", //switch color, cancel
  },
];

const colors = ["#ffffff", "#3d1591", "#F7C924", "#F96C6C"];

export default class Player {
  constructor(w, h, brushImage, playerIndex) {
    const { x, y } = startingPositions[playerIndex](w, h);
    const { keyUp, keyDown, keyLeft, keyRight, keyButton1, keyButton2 } =
      keyButtons[playerIndex];

    this.active = false;
    this.facing = "down";
    this.isMoving = false;
    this.bop = "up";
    this.isDrawing = false;

    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.brushImage = brushImage;
    this.color = colors[playerIndex];
    this.keyUp = keyUp;
    this.keyDown = keyDown;
    this.keyLeft = keyLeft;
    this.keyRight = keyRight;
    this.keyButton1 = keyButton1;
    this.keyButton2 = keyButton2;
  }
}
