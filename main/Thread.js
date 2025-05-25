//Thread class
export class Thread {
  constructor(color, prev, next) {
    this.color = color;
    this.prev = prev;
    this.next = next;
    this.path = [];
  }

  setColor(newColor) {
    this.color = newColor;
  }

  setPrev(x,y) {
    this.prev = [x,y];
  }

  setNext(x,y) {
    this.next = [x,y];
  }

  addCoord(x,y) {
    this.path.push([x,y]);
  }
}