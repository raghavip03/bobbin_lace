/**
 * Class Design for Bobbin Lace Abstraction
 */
import {Thread} from './Thread.js';
//initializes pins and assigns 4 threads per pin
//Builds a thread class
export class BobbinLace {
  constructor(pinCount, rowCount, spacingX, spacingY) {
    this.pinCount = pinCount;
    this.rowCount = rowCount;
    this.spacingX = spacingX;
    this.spacingY  = spacingY;
  }

  //random color generator
  getRandomNamedColor() {
    const colors = ["red", "blue", "green", "orange", "purple", "pink", "yellow", "brown", "black", "gray"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

    /**
   * Draws a grid of pins as the inital set up
   * @param {}
   * @returns {}
   * */
  //NOTE: come back and think about making this a draw function
    initializeGrid() {
      const startX = 50;
      const startY = 50;

      let shiftX = (0 % 2) * (this.spacingX / 2);
      let x = startX + 0 * this.spacingX + shiftX;
      let y = startY + 0 * this.spacingY;

       //thread assignment and first pin coordinate
      return this.assignInitialThreads(this.pinCount, x, y)
  }

    //assign each pin 4 threads and return array of threads + first coordinate and an x spacing
    assignInitialThreads(pinCount, x, y) {
      const threads = [];
      for (let i = 0; i < pinCount; i++) {
        //create 4 thread objects per pin and color them with random colors
        for (let j = 0; j < 4; j++) {
          const color = this.getRandomNamedColor();
          const t = new Thread(color);
          threads.push(t);
        }
      }
      //threads array + first thread starting coordinate
      //NOTE: 15 and 17 are just constants to make the threads appear near the pin
      return [threads, [x - 15, y + 17]];
  }
}
