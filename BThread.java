public class BThread {
  String color;
  int value;

  public BThread(int value) {
    this.value = value;
    this.color = null;
  }

  //value and color
  public BThread(int value, String color) {
    this.value = value;
    this.color = color;
  }

  //to String if not it will print object rferences
  public String toString() {
    return color != null ? value + "(" + color + ")": String.valueOf(value);
  }
}
