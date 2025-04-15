class Bobbin {
  String name;
  String col;
  int xPos;
  int yPos;
  
  Bobbin() {
    this.name = "";
    this.col = "red";
    this.xPos = 0;
    this.yPos = 0;
  }
  
  Bobbin(String name, String col) {
    this.name = name;
    this.col = col;
  }
  
  @Override
  String toString() {
    return name + "(" + col + ")";
  }
}

ArrayList<Bobbin> bobbins = new ArrayList<>();
ArrayList<ArrayList<Integer>> moves = new ArrayList<>();

void setup() {
  size(400, 400);
  torchonGround();
  println("Final state:");
  for (int i = 0; i < bobbins.size(); i++) {
    println("Position " + i + ": " + bobbins.get(i));
  }
  println("Total moves: " + moves.size());
}

void draw() { }

void torchonGround() {
  for (int i = 1; i < 5; i++) {
    bobbins.add(new Bobbin("b" + i, "red"));
  }
  
  println(bobbins);
  
  for (int i = 0; i < 100; i++) {
    // could turn this entire sequence into one method
    ArrayList<Integer> torchon = new ArrayList<>();
    torchon.add(2);
    torchon.add(-1);
    torchon.add(-3);
    torchon.add(2);
    torchon.add(-1);
    torchon.add(-3);

    // can also turn swapping of bobbins into a method
    
    // cross 1
    Bobbin temp = bobbins.get(1);
    bobbins.set(1, bobbins.get(2));
    bobbins.set(2, temp);
    
    // twist 1
    temp = bobbins.get(0);
    bobbins.set(0, bobbins.get(1));
    bobbins.set(1, temp);
    temp = bobbins.get(2);
    bobbins.set(2, bobbins.get(3));
    bobbins.set(3, temp);
    
    // cross 2
    temp = bobbins.get(1);
    bobbins.set(1, bobbins.get(2));
    bobbins.set(2, temp);
    
    // twist 2
    temp = bobbins.get(0);
    bobbins.set(0, bobbins.get(1));
    bobbins.set(1, temp);
    temp = bobbins.get(2);
    bobbins.set(2, bobbins.get(3));
    bobbins.set(3, temp);
    
    moves.add(torchon);
    
    println(moves.get(moves.size() - 1));
    println(bobbins);
  }
}
