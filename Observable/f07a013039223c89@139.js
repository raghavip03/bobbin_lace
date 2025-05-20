import define1 from "./493851ae5989f70a@398.js";
import define2 from "./b8901a674fce0b00@114.js";
import define3 from "./41c6a3678f286c05@83.js";

function _4(p5,width){return(
p5(sketch => {
  sketch.setup = function(){
    sketch.createCanvas(width, 300); // width is an Observable variable here
  }
  sketch.draw = function(){
    
    sketch.background(255);
    let points = [1, 2, 3, 4];
    for (let row = 1; row < 10; row++) {
      for (let group = 0; group < 8; group += 4) {
        if (row % 2 === 1) {
            sketch.stroke('black');
            sketch.strokeWeight(2);
            sketch.line(30 * (1 + group), row * 30, 30 * (1 + group), (row + 1) * 30)
            sketch.line(30 * (4 + group), row * 30, 30 * (4 + group), (row + 1) * 30)
            sketch.line(30 * (3 + group), row * 30, 30 * (2 + group), (row + 1) * 30)
        
            sketch.stroke('white');
            sketch.strokeWeight(5);
            sketch.line(30 * (2 * group) + 1, row * 30 + 1, 30 * (3 * group) - 1, (row + 1) * 30 - 1)
          
            sketch.stroke('black');
            sketch.strokeWeight(2);
            sketch.line(30 * (2 + group), row * 30, 30 * (3 + group), (row + 1) * 30)
  
            sketch.strokeWeight(0.5);
            sketch.text("actions: 2", 300, row * 30 + 15)
  
        } else {
            sketch.stroke('black');
            sketch.strokeWeight(2);
            sketch.line(30 * (1 + group), row * 30, 30 * (2 + group), (row + 1) * 30)
            sketch.line(30 * (3 + group), row * 30, 30 * (4 + group), (row + 1) * 30)
          
            sketch.stroke('white');
            sketch.strokeWeight(5);
            sketch.line(30 * (2 + group) - 4, row * 30 - 3, 30 * (1 + group) + 3, (row + 1) * 30 + 3)
            sketch.line(30 * (4 + group) - 4, row * 30 - 3, 30 * (3 + group) + 3, (row + 1) * 30 + 3)
          
            sketch.stroke('black');
            sketch.strokeWeight(2);
            sketch.line(30 * (2 + group), row * 30, 30 * (1 + group), (row + 1) * 30)
            sketch.line(30 * (4 + group), row * 30, 30 * (3 + group), (row + 1) * 30)
          
            sketch.strokeWeight(0.5);
            sketch.text("actions: -1, -3", 300, row * 30 + 15) 
        }
      // if (row % 2 === 1) {
      //   let temp = points[1]
      //   points[1] = points[2]
      //   points[2] = temp
      // } else {
      //   let temp = points[0]
      //   points[0] = points[1]
      //   points[1] = temp
      //   temp = points[2]
      //   points[2] = points[3]
      //   points[3] = temp
      // }
      }
    }

  }
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  const child1 = runtime.module(define1);
  main.import("p5", child1);
  const child2 = runtime.module(define2);
  main.import("toc", child2);
  const child3 = runtime.module(define3);
  main.import("js", child3);
  main.variable(observer()).define(["p5","width"], _4);
  return main;
}
