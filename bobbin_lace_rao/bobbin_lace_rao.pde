//class Bobbin {
//  String name;
//  color col;
//  float xPos;
//  float yPos;

//  Bobbin(String name, color col, float x, float y) {
//    this.name = name;
//    this.col = col;
//    this.xPos = x;
//    this.yPos = y;
//  }

//  void drawBobbin() {
//    stroke(0);
//    fill(col);
//    ellipse(xPos, yPos, 40, 40);
//    fill(0);
//    textAlign(CENTER, CENTER);
//    text(name, xPos, yPos);
//  }
//}


//ArrayList<Bobbin> bobbins = new ArrayList<>();
//float[] xSlots = {100, 250, 400, 550};  // spaced out more
//float yStep = 100;
//int step = 0;
//int maxSteps = 100;
//int moveDelay = 20;

//void setup() {
//  size(700, 1500);
//  frameRate(10);
//  initBobbins();
//}

//void draw() {
//  background(255);

//  // Draw trails
//  for (Bobbin b : bobbins) {
//    b.drawTrail();
//  }

//  // Draw bobbins
//  for (Bobbin b : bobbins) {
//    b.drawBobbin();
//  }

//  // Perform torchon every few frames
//  if (frameCount % moveDelay == 0 && step < maxSteps) {
//    performTorchon();
//    step++;
//  }
//}

//void initBobbins() {
//  bobbins.clear();
//  color[] colors = {
//    color(255, 100, 100),   // red
//    color(100, 150, 255),   // blue
//    color(100, 255, 100),   // green
//    color(255, 180, 60)     // orange
//  };

//  for (int i = 0; i < 4; i++) {
//    bobbins.add(new Bobbin("b" + (i + 1), colors[i], xSlots[i], 50));
//  }
//}

//void performTorchon() {
//  // Move bobbins down before swapping
//  for (Bobbin b : bobbins) {
//    b.updatePosition(b.xPos, b.yPos + yStep);
//  }

//  // Cross 1: 1 <-> 2
//  swap(1, 2);
//  // Twist 1: 0<->1, 2<->3
//  swap(0, 1);
//  swap(2, 3);
//  // Cross 2: 1 <-> 2
//  swap(1, 2);
//  // Twist 2: 0<->1, 2<->3
//  swap(0, 1);
//  swap(2, 3);

//  // Update x positions to match new indices
//  for (int i = 0; i < 4; i++) {
//    bobbins.get(i).xPos = xSlots[i];
//  }
//}

//void swap(int i, int j) {
//  Bobbin temp = bobbins.get(i);
//  bobbins.set(i, bobbins.get(j));
//  bobbins.set(j, temp);
//}

class Bobbin {
  String name;
  color col;
  float xPos;
  float yPos;

  Bobbin(String name, color col, float x, float y) {
    this.name = name;
    this.col = col;
    this.xPos = x;
    this.yPos = y;
  }

  void drawBobbin() {
    stroke(0);
    fill(col);
    ellipse(xPos, yPos, 40, 40);
    fill(0);
    textAlign(CENTER, CENTER);
    text(name, xPos, yPos);
  }
}

class ThreadSegment {
  PVector start;
  PVector end;
  color col;

  ThreadSegment(PVector start, PVector end, color col) {
    this.start = start;
    this.end = end;
    this.col = col;
  }

  void drawSegment() {
    stroke(col);
    strokeWeight(2);
    line(start.x, start.y, end.x, end.y);
  }
}

ArrayList<Bobbin> bobbins = new ArrayList<>();
ArrayList<ThreadSegment> threadSegments = new ArrayList<>();

float[] xSlots = {100, 250, 400, 550};  // spaced like real lace
float yStep = 100;
int step = 0;
int maxSteps = 100;
int moveDelay = 60;

void setup() {
  size(700, 1500);
  frameRate(30);
  initBobbins();
}

void draw() {
  background(255);

  // Draw all thread segments
  for (ThreadSegment t : threadSegments) {
    t.drawSegment();
  }

  // Draw current bobbins
  for (Bobbin b : bobbins) {
    b.drawBobbin();
  }

  // Perform one move every moveDelay frames
  if (frameCount % moveDelay == 0 && step < maxSteps) {
    performTorchon();
    step++;
  }
}

void initBobbins() {
  bobbins.clear();
  color[] colors = {
    color(255, 100, 100),   // red
    color(100, 150, 255),   // blue
    color(100, 255, 100),   // green
    color(255, 180, 60)     // orange
  };

  for (int i = 0; i < 4; i++) {
    bobbins.add(new Bobbin("b" + (i + 1), colors[i], xSlots[i], 50));
  }
}

void performTorchon() {
  // Move bobbins downward (final yPos)
  for (Bobbin b : bobbins) {
    b.yPos += yStep;
  }

  // Cross 1: 1 <-> 2
  swapAndDraw(1, 2);

  // Twist 1: 0<->1, 2<->3
  swapAndDraw(0, 1);
  swapAndDraw(2, 3);

  // Cross 2: 1 <-> 2
  swapAndDraw(1, 2);

  // Twist 2: 0<->1, 2<->3
  swapAndDraw(0, 1);
  swapAndDraw(2, 3);

  // Snap bobbin x-positions to their visual slots
  for (int i = 0; i < 4; i++) {
    bobbins.get(i).xPos = xSlots[i];
  }
}

void swapAndDraw(int i, int j) {
  Bobbin a = bobbins.get(i);
  Bobbin b = bobbins.get(j);

  // Store current positions before swap
  PVector aStart = new PVector(a.xPos, a.yPos - yStep);
  PVector bStart = new PVector(b.xPos, b.yPos - yStep);

  // Target positions (swap destinations)
  PVector aEnd = new PVector(xSlots[j], a.yPos);
  PVector bEnd = new PVector(xSlots[i], b.yPos);

  // Add threads to list
  threadSegments.add(new ThreadSegment(aStart, aEnd, a.col));
  threadSegments.add(new ThreadSegment(bStart, bEnd, b.col));

  // Swap in list
  bobbins.set(i, b);
  bobbins.set(j, a);
}
