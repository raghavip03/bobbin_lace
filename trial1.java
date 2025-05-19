import java.util.HashMap;

public class trial1 {
  //Map of ground to stitch
  static HashMap<String,BThread[]> groundToBraids = new HashMap<>();
  static {
    //NOTE: make the array a BThread array
    groundToBraids.put("torchon", new BThread[]{
      new BThread(2),
      new BThread(-1),
      new BThread(-3),
      new BThread(2),
      new BThread(-1),
      new BThread(-3)
  });

  }
  //print to debug 2d array of threads
  public static void main(String[] args) {
    print3DArray(generateGround(5, 5, "torchon"));
  }

  public static BThread[][][] generateGround(int rows, int cols, String ground) {
    int colsVisual = cols + (cols - 1);
    BThread[][][] laceRepresentation = new BThread[rows][colsVisual][];
    BThread[] braidGroup = groundToBraids.get(ground);

    for (int i = 0; i < rows; i++){
      for (int j = 0; j < colsVisual; j++) {
        //odd rows add to odd cols
        if (i % 2 == 1) {
          if (j % 2 == 1) {
            laceRepresentation[i][j] = braidGroup;
          } else {
            laceRepresentation[i][j] = new BThread[0];
          }
        }
        else {
          if (j % 2 == 0) {
            laceRepresentation[i][j] = braidGroup;
           } else {
            laceRepresentation[i][j] = new BThread[0];
          }
        }
      }
    }

    return laceRepresentation;
  }

  //print array
  public static void print3DArray(BThread[][][] arr) {
    for (int i = 0; i < arr.length; i++) {
        System.out.print("Row " + i + ": ");
        for (int j = 0; j < arr[i].length; j++) {
            System.out.print(java.util.Arrays.toString(arr[i][j]) + " ");
        }
        System.out.println();
    }
}
}
