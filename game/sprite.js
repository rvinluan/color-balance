import * as constants from "./constants.js";

const { SPRITE_WIDTH, SPRITE_HEIGHT, BORDER_WIDTH, SPACING_WIDTH } = constants;

export class Sprite {
  spriteImage = "";
  constructor(spriteImage) {
    this.spriteImage = spriteImage;
  }

  spritePositionToImagePosition(row, col) {
    return {
      x: BORDER_WIDTH + row * (SPACING_WIDTH + SPRITE_WIDTH),
      y: BORDER_WIDTH + col * (SPACING_WIDTH + SPRITE_HEIGHT),
    };
  }

  getSpritePosition(player, playerIndex) {
    const playerOffset = playerIndex * 10;
    const playerBop = player.bop == "up" || player.facing == "up" ? 0 : 1;
    let facingOffset;
    switch (player.facing) {
      case "up":
        facingOffset = 6;
        break;
      case "left":
        facingOffset = 5;
        break;
      case "right":
        facingOffset = 4;
        break;
      default:
        facingOffset = 0;
        break;
    }
    return [0 + playerBop, 0 + (playerOffset + facingOffset)];
  }

  bop(players) {
    players.forEach((player) => {
      if (!player.isMoving) {
        player.bop = player.bop == "up" ? "down" : "up";
      }
    });
  }
}
