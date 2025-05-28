export class Diamond {
  constructor(left, right, top, bottom) {
    this.left = left; //left coordinate
    this.right = right; //right coordinate
    this.top = top; //top coordinate
    this.bottom = bottom; //bottom coordinate
  }

  drawDiamond(ctx, color) {
    ctx.beginPath();
    ctx.strokeStyle = '#ddd';
    ctx.moveTo(this.top.x, this.top.y);
    ctx.lineTo(this.right.x, this.right.y);
    ctx.lineTo(this.bottom.x, this.bottom.y);
    ctx.lineTo(this.left.x, this.left.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }
}