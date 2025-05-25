//This takes the abstraction and visualizes the bobbin lace
import { BobbinLace } from './BobbinLace.js';
import { Region } from './Region.js';
import { Thread } from './Thread.js';

//constant global variables
const canvas = document.getElementById('laceCanvas');
const ctx = canvas.getContext('2d');
const startX = 50;
const startY = 50;
const spacingX = 65;
const spacingY = 100;

/**
 * Main Class for HTML to run
 */
export function generateLace() {
  //NOTE: put something here
  const pinCount = parseInt(document.getElementById('pins').value);
  const rowCount = parseInt(document.getElementById('rows').value);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Draw pin grid
  drawGrid(pinCount, rowCount, spacingX, spacingY);

  //draw initial thread coordinates for debugging
  const lace = new BobbinLace(pinCount, rowCount, spacingX, spacingY);
  const updatedThreads = drawInitThreads(lace);

  //drawing the braids
  drawBraid(updatedThreads, rowCount);
}

//dom event listern
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector("button").addEventListener("click", generateLace);
});

/**
 * Draw the Pin grid and assign 4 threads to the top pins
 */
function drawGrid(pinCount, rowCount, spacingX, spacingY) {
  ctx.strokeStyle = '#ddd';
  ctx.fillStyle = '#000';

  for (let j = 0; j <= rowCount; j++) {
    let shiftX = (j % 2) * (spacingX / 2);
    let count = j % 2 === 1 ? pinCount - 1 : pinCount;

    for (let i = 0; i < count; i++) {
      let x = startX + i * spacingX + shiftX;
      let y = startY + j * spacingY;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Draws initial thread coordinates
 */
function drawInitThreads(lace) {
  const [threads, firstThreadCoord] = lace.initializeGrid();
  const [x,y] = firstThreadCoord;

  for (let i = 0; i < threads.length; i++) {
    const offsetX = i * 16; //to space threads out
    const drawX = x + offsetX;
    const drawY = y; //y value wont change

    //store x and y in each thread's perv
    threads[i].setPrev(drawX,drawY);

    //draw the dots
    ctx.beginPath();
    ctx.arc(drawX, drawY, 3, 0, Math.PI * 2); // small circle
    ctx.fillStyle = threads[i].color || "#000"; // use thread color
    ctx.fill();
  }
  return threads;
}

/**
 * Perform braids on 4 threads
 */
function drawBraid(threads, rowCount) {
  //extract the current thread coordinates stored in thread.prev
  let rowNum = 0;
  while (rowNum < rowCount)  {
    if (rowNum % 2 === 0) { //even rows
      for (let i = 2; i < threads.length - 2; i += 4) {
        const fourThreads = threads.slice(i,i+4);
        eachBraid(fourThreads);
      }
    } else { //odd rows
      for (let i  = 0; i < threads.length; i += 4) {
        const fourThreads = threads.slice(i,i+4);
        eachBraid(fourThreads);
      }
    }
    rowNum += 1;
  }
}

/**
 * Helper function to run the braid
 */
function eachBraid(fourThreads) {
    const initialCoords = [];

    //storing the current coordinates as prev so we can build new ones
    for(let t of fourThreads) { //even rows
      initialCoords.push(t.prev);
    }
    console.log(initialCoords);

    //calls region class
    const fourThreadRegion = new Region(fourThreads, initialCoords);

    //cross
    //const crossCoords1  = fourThreadRegion.generateNextCoords(initialCoords);
    const [cross_order1, crossCoords1] = fourThreadRegion.cross(fourThreads, initialCoords);
    visualizeStitch(initialCoords, crossCoords1, fourThreads, cross_order1);

    //twist
    //const twistCoords1 = fourThreadRegion.generateNextCoords(crossCoords1);
    const [twist_order1,twistCoords1]  = fourThreadRegion.twist(cross_order1, crossCoords1);
    visualizeStitch(crossCoords1, twistCoords1, cross_order1, twist_order1);

    //cross
    //const crossCoords2  = fourThreadRegion.generateNextCoords(twistCoords1);
    const [cross_order2,crossCoords2]  = fourThreadRegion.cross(twist_order1, twistCoords1);
    visualizeStitch(twistCoords1, crossCoords2, twist_order1, cross_order2);

    //twist
    //const twistCoords2 = fourThreadRegion.generateNextCoords(crossCoords2);
    const [twist_order2,twistCoords2]  = fourThreadRegion.twist(cross_order2, crossCoords2);
    visualizeStitch(crossCoords2, twistCoords2, cross_order2, twist_order2);
}

// /**
//  * Visualize per stitch
//  */

//there is an extra line getting drawn each time? idk why
function  visualizeStitch(prevCoords, endCoords, beforeThreads, afterThreads) {
  for (let i = 0; i < prevCoords.length; i++) {
    const [x, y] = prevCoords[i];
    const [x2, y2] = endCoords[i];
    if (x !== x2 || y !== y2) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = beforeThreads[i].color || "#000";
      ctx.stroke();
    }

  }
}