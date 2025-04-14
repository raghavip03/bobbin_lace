import java.util.HashMap;

public class trial1 {
  //Map of ground to stitch
  static HashMap<String,int[]> groundToBraids = new HashMap<>();
  static {
    //NOTE: make the array a BThread array
    groundToBraids.put("torchon", new int[]{2,-1,-3,2,-1,-3});
  }
  //print and debug 2d array of threads
  public static void main(String[] args) {
    print3DArray(generateGround(5, 5, "torchon"));
  }

  public static int[][][] generateGround(int rows, int cols, String ground) {
    int colsVisual = cols + (cols - 1);
    int[][][] laceRepresentation = new int[rows][colsVisual][];
    int[] braidGroup = groundToBraids.get(ground);

    for (int i = 0; i < rows; i++){
      for (int j = 0; j < colsVisual; j++) {
        //odd rows add to odd cols
        if (i % 2 == 1) {
          if (j % 2 == 1) {
            laceRepresentation[i][j] = braidGroup;
          } else {
            laceRepresentation[i][j] = new int[0];
          }
        }
        else {
          if (j % 2 == 0) {
            laceRepresentation[i][j] = braidGroup;
           } else {
            laceRepresentation[i][j] = new int[0];
          }
        }
      }
    }

    return laceRepresentation;
  }

  //print array
  public static void print3DArray(int[][][] arr) {
    for (int i = 0; i < arr.length; i++) {
        System.out.print("Row " + i + ": ");
        for (int j = 0; j < arr[i].length; j++) {
            System.out.print(java.util.Arrays.toString(arr[i][j]) + " ");
        }
        System.out.println();
    }
}
}
