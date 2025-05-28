//This takes the abstraction and visualizes the bobbin lace
import { BobbinLace } from './BobbinLace.js';
import { Region } from './Region.js';
import { Thread } from './Thread.js';
import { Diamond } from './Diamond.js';

//constant global variables
const canvas = document.getElementById('laceCanvas');
const ctx = canvas.getContext('2d');
const startX = 50;
const startY = 50;
const spacingX = 65;
const spacingY = 100;

// global variable to store grid of diamonds
let diamondGrid = [];

/**
 * Main Class for HTML to run
 */
export function generateLace() {
  //NOTE: put something here
  const pinCount = parseInt(document.getElementById('pins').value);
  const rowCount = parseInt(document.getElementById('rows').value);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  diamondGrid = [];

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
 * Creates the regions for the pin grid with better randomization and balanced splits
 */
function createRegions() {
  if (!diamondGrid.length || !diamondGrid[0]) {
    console.error("Diamond grid not properly initialized");
    return;
  }

  const numRows = diamondGrid.length;
  const numCols = diamondGrid[0].length;

  // Reset all diamond regionIds from previous runs
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const diamond = diamondGrid[r][c];
      if (diamond) {
        delete diamond.regionId;
      }
    }
  }

  const visited = new Set();
  const regions = [[], [], []];
  const queues = [[], [], []];

  // Get all diamond positions
  const diamondPositions = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (diamondGrid[r][c]) {
        diamondPositions.push([r, c]);
      }
    }
  }

  console.log('Total diamonds found:', diamondPositions.length);
  console.log('Grid dimensions:', numRows, 'x', numCols);
  console.log('Sample diamond positions:', diamondPositions.slice(0, 10));
  
  // Debug: Show the actual grid structure
  console.log('Grid structure:');
  for (let r = 0; r < Math.min(5, numRows); r++) {
    const rowString = [];
    for (let c = 0; c < numCols; c++) {
      rowString.push(diamondGrid[r][c] ? 'D' : '.');
    }
    console.log(`Row ${r}: ${rowString.join(' ')}`);
  }

  const totalDiamonds = diamondPositions.length;
  const targetSizePerRegion = Math.floor(totalDiamonds / 3);
  
  // Pick 3 random seed points that are reasonably spread apart
  const seeds = pickSpreadSeeds(diamondPositions, 3);
  console.log('Selected seeds:', seeds);
  
  // Debug: Check what's around each seed
  for (let i = 0; i < seeds.length; i++) {
    const [r, c] = seeds[i];
    console.log(`Seed ${i} at [${r},${c}]:`);
    for (const [dr, dc] of [[1,0], [-1,0], [0,1], [0,-1]]) {
      const nr = r + dr;
      const nc = c + dc;
      const hasNeighbor = nr >= 0 && nr < numRows && nc >= 0 && nc < numCols && diamondGrid[nr][nc];
      console.log(`  Direction [${dr},${dc}] -> [${nr},${nc}]: ${hasNeighbor ? 'HAS DIAMOND' : 'no diamond'}`);
    }
  }

  // Initialize seeds for each region
  for (let regionId = 0; regionId < 3; regionId++) {
    const [r, c] = seeds[regionId];
    const key = `${r},${c}`;
    visited.add(key);
    queues[regionId].push([r, c]);
    diamondGrid[r][c].regionId = regionId;
    regions[regionId].push(diamondGrid[r][c]);
  }

  console.log('Initial queue states:', queues.map(q => q.length));

  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

  // Round-robin expansion with target-based balancing
  let expansionCount = 0;
  while (queues.some(q => q.length > 0)) {
    // Create a list of all available expansions from all regions
    const allPossibleExpansions = [];
    
    for (let regionId = 0; regionId < 3; regionId++) {
      const queue = queues[regionId];
      const currentSize = regions[regionId].length;
      
      // Multi-tier balancing strategy
      const otherSizes = regions.filter((_, i) => i !== regionId).map(r => r.length);
      const maxOtherSize = Math.max(...otherSizes);
      const minOtherSize = Math.min(...otherSizes);
      
      // Skip if this region is significantly over target AND larger than others
      if (currentSize > targetSizePerRegion + 2 && currentSize > maxOtherSize) {
        continue;
      }
      
      // Skip if this region is more than 2 larger than the smallest region
      if (currentSize > minOtherSize + 2) {
        continue;
      }
      
      // Find all possible expansions for this region
      for (let queueIndex = 0; queueIndex < queue.length; queueIndex++) {
        const [r, c] = queue[queueIndex];
        
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
          const key = `${nr},${nc}`;
          if (
            nr >= 0 && nr < numRows &&
            nc >= 0 && nc < numCols &&
            diamondGrid[nr][nc] &&
            !visited.has(key)
          ) {
            allPossibleExpansions.push({
              regionId,
              from: [r, c],
              to: [nr, nc],
              key
            });
          }
        }
      }
    }
    
    if (expansionCount < 10) {
      console.log(`Expansion ${expansionCount}: Found ${allPossibleExpansions.length} possible expansions`);
      console.log('Current region sizes:', regions.map(r => r.length));
    }
    
    if (allPossibleExpansions.length === 0) break;
    
    // Prioritize expansions based on how far each region is from target
    const prioritizedExpansions = allPossibleExpansions.map(expansion => {
      const regionSize = regions[expansion.regionId].length;
      const distanceFromTarget = Math.abs(regionSize - targetSizePerRegion);
      const isUnderTarget = regionSize < targetSizePerRegion;
      
      return {
        ...expansion,
        priority: isUnderTarget ? (targetSizePerRegion - regionSize) * 2 : -distanceFromTarget,
        regionSize
      };
    });
    
    // Sort by priority (higher priority first) and add some randomness
    prioritizedExpansions.sort((a, b) => {
      const priorityDiff = b.priority - a.priority;
      // If priorities are similar, add randomness
      if (Math.abs(priorityDiff) <= 1) {
        return Math.random() - 0.5;
      }
      return priorityDiff;
    });
    
    // Pick from top 30% of prioritized expansions to maintain some randomness
    const topChoices = Math.max(1, Math.floor(prioritizedExpansions.length * 0.3));
    const randomExpansion = prioritizedExpansions[Math.floor(Math.random() * topChoices)];
    const { regionId, from, to, key } = randomExpansion;
    const [nr, nc] = to;
    
    // Execute the expansion
    visited.add(key);
    diamondGrid[nr][nc].regionId = regionId;
    regions[regionId].push(diamondGrid[nr][nc]);
    queues[regionId].push([nr, nc]);
    
    expansionCount++;
    
    // Clean up queues by removing positions that have no more valid neighbors
    for (let regionId = 0; regionId < 3; regionId++) {
      queues[regionId] = queues[regionId].filter(([r, c]) => {
        for (const [dr, dc] of directions) {
          const checkNr = r + dr;
          const checkNc = c + dc;
          const checkKey = `${checkNr},${checkNc}`;
          if (
            checkNr >= 0 && checkNr < numRows &&
            checkNc >= 0 && checkNc < numCols &&
            diamondGrid[checkNr][checkNc] &&
            !visited.has(checkKey)
          ) {
            return true; // Keep this position in queue
          }
        }
        return false; // Remove this position from queue
      });
    }
  }

  // First draw all diamond outlines
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const diamond = diamondGrid[row][col];
      if (diamond) {
        // Draw just the outline (no fill)
        diamond.drawDiamond(ctx, 'transparent');
      }
    }
  }

  // Then draw diamonds with region colors (only assigned diamonds get filled)
  const regionColors = ['rgba(255,100,100,0.6)', 'rgba(100,255,100,0.6)', 'rgba(100,100,255,0.6)'];
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const diamond = diamondGrid[row][col];
      if (diamond && diamond.regionId != null) {
        const color = regionColors[diamond.regionId];
        diamond.drawDiamond(ctx, color);
      }
    }
  }

  // Log region sizes and target for debugging
  console.log('Target size per region:', targetSizePerRegion);
  console.log('Region sizes:', regions.map(r => r.length));
  console.log('Total diamonds assigned:', regions.reduce((sum, r) => sum + r.length, 0), '/', totalDiamonds);
  
  return regions;
}

/**
 * Pick seed points that are reasonably spread apart
 */
function pickSpreadSeeds(positions, count) {
  if (positions.length <= count) return positions;
  
  const seeds = [];
  const remaining = [...positions];
  
  // Pick first seed randomly
  let firstIndex = Math.floor(Math.random() * remaining.length);
  seeds.push(remaining.splice(firstIndex, 1)[0]);
  
  // Pick remaining seeds with preference for distance from existing seeds
  for (let i = 1; i < count; i++) {
    let bestDistance = -1;
    let bestCandidates = [];
    
    // Find positions with maximum minimum distance to existing seeds
    for (let j = 0; j < remaining.length; j++) {
      const candidate = remaining[j];
      const minDistToSeeds = Math.min(...seeds.map(seed => 
        Math.abs(candidate[0] - seed[0]) + Math.abs(candidate[1] - seed[1])
      ));
      
      if (minDistToSeeds > bestDistance) {
        bestDistance = minDistToSeeds;
        bestCandidates = [j];
      } else if (minDistToSeeds === bestDistance) {
        bestCandidates.push(j);
      }
    }
    
    // Randomly pick from best candidates
    const randomBestIndex = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
    seeds.push(remaining.splice(randomBestIndex, 1)[0]);
  }
  
  return seeds;
}

// Fisher-Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Draw the Pin grid and assign 4 threads to the top pins
 */
function drawGrid(pinCount, rowCount, spacingX, spacingY) {
  ctx.strokeStyle = '#ddd';
  ctx.fillStyle = '#000';

  for (let j = 0; j <= rowCount; j++) {
    let shiftX = (j % 2) * (spacingX / 2);
    let count = j % 2 === 1 ? pinCount - 1 : pinCount;
    let row = new Array(pinCount * 2 - 1).fill(null);

    for (let i = 0; i < count; i++) {
      let x = startX + i * spacingX + shiftX;
      let y = startY + j * spacingY;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // diamonds
      if (j % 2 == 0) {
        if (i != count - 1) {
          const diamond = new Diamond(
            {x: x, y: y},
            {x: x + spacingX, y: y},
            {x: x + spacingX / 2, y: y - spacingY},
            {x: x + spacingX / 2, y: y + spacingY}
          );
          row[i * 2 + 1] = diamond;
        }
      } else {
        if (i != count - 1) {
          const diamond = new Diamond(
            {x: x - spacingX, y: y},
            {x: x, y: y},
            {x: x - spacingX / 2, y: y + spacingY},
            {x: x - spacingX / 2, y: y - spacingY}
          );
          row[i * 2] = diamond;
        } else {
          const diamondLeft = new Diamond(
            {x: x - spacingX, y: y},
            {x: x, y: y},
            {x: x - spacingX / 2, y: y + spacingY},
            {x: x - spacingX / 2, y: y - spacingY}
          );
          const diamondRight = new Diamond(
            {x: x, y: y},
            {x: x + spacingX, y: y},
            {x: x + spacingX / 2, y: y - spacingY},
            {x: x + spacingX / 2, y: y + spacingY}
          );
          row[i * 2] = diamondLeft;
          row[(i+1) * 2] = diamondRight;
        }
      }
    }
    diamondGrid.push(row);
  }
  createRegions();
  console.log(diamondGrid);
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