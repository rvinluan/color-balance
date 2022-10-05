const spriteWidth = 16;
const spriteHeight = 16;
const borderWidth = 1;
const spacingWidth = 0;

export class Sprite {
  constructor(spriteImage) {
    this.spriteImage = spriteImage;
  }

  spritePositionToImagePosition(row, col) {
    return {
      x: borderWidth + row * (spacingWidth + spriteWidth),
      y: borderWidth + col * (spacingWidth + spriteHeight),
    };
  }

  drawSprite(canvasContext, player, playerIndex) {
    let [row, col] = this.getSpritePosition(player, playerIndex)
    const spritePosition = this.spritePositionToImagePosition(row, col)
    canvasContext.drawImage(
      this.spriteImage,
      spritePosition.x,
      spritePosition.y,
      16,
      16,
      player.x + 16,
      player.y + 16,
      16,
      16
    );
  }

  getSpritePosition(player, playerIndex) {
    // TODO - make it real
    return [0, 0 + (playerIndex * 10)];
  }
}
