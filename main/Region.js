////---------------------REGION-------------------------///
//Takes a region or 4 threads and performs braid (abstractly not visual)
//and returns the order of braid drawings plus coordinates
export class Region {
  //4 thread objects storing color
  constructor(threads, prevCoords) {
    this.threads = threads; //array of thread (4)
    this.prevCoords = prevCoords; // thread coordinates []
    this.ground = [-1, 2, [-1,-3], -1, 2, [-1,-3]];
  }

  //performs one braid of torchon ground or CTCT
  braid() {
    const crossCoords1  = this.generateNextCoords(this.prevCoords); //generates coordinates to perform cross
    const cross_order1 = this.cross(this.threads);

    const twistCoords1 = this.generateNextCoords(crossCoords1); //generates coordinates to perfrom twist
    const twist_order1 = this.twist(cross_order1);

    const crossCoords2  = this.generateNextCoords(twistCoords1); //generates coordinates to perform cross
    const cross_order2 = this.cross(twist_order1);

    const twistCoords2 = this.generateNextCoords(crossCoords2); //generates coordinates to perfrom twist
    const twist_order2 = this.twist(cross_order2);

    //NOTE: might need to return coordinates as well.
    return [
      [cross_order1, crossCoords1],
      [twist_order1, twistCoords1],
      [cross_order2, crossCoords2],
      [twist_order2, twistCoords2]
    ];

  }

  /**
   * This method generates new coordinates from where the upcoming braid is
   * going to end up in. It then assigns the new coordinate to thread.next and
   * stores the older prev value in an array called path inside the thread Object.
   * Also returns the new generated coordinates to be used by the next set of
   * stitch operations.
   *
   * @param
   * @return
   */
  generateNextCoords(coords) {
    console.log("calling generate next coords, ", coords);
    const nextCoords = [];
    //store a history of prev,next values of a thread for debugging or easy access
    for (let i = 0; i < this.threads.length; i++) {
      const prev = this.threads[i].prev;
      const next = this.threads[i].next;

      //NOTE: this is not the correct form of pushing
      this.threads[i].addCoord([prev,next]);
    }

    //these are constants to generate coordinates in the same path
    const x_space = 1;
    const y_space = 1;

    for(let i = 0; i < coords.length; i++) {
      let [x,y] = coords[i];
      nextCoords[i] = [x + x_space, y + y_space];
      this.threads[i].setNext([x + x_space, y + y_space]);
    }

    return nextCoords;
  }

  /**
   * Crosses thread2 and thread3 and returns the order of the threads after
   * the cross operation
   * @param {*} threads
   */
  cross(threads, coords) {
    const y_space = 30;
    const x_space = 12;

    const thread2 = threads[1].next;
    const thread3 = threads[2].next;

    //swap or cross them
    threads[1].next = thread3;
    threads[2].next = thread2;

    //generate coordinates of the stitch locations using prev coordinates
    const nextCoords = [];

    for (let i = 0; i < 4; i++) {
      //if 1st or 4th thread then they move down in a straight line only y changes
      const [x,y] = coords[i]; //i = 0 or 3
      const [x_new, y_new] = [x, y + y_space]; //NOTE: constant 12
      nextCoords[i] = [x_new,y_new];
    }

    //return the order of threads after the cross operation
    return [
      [threads[0], threads[2], threads[1], threads[3]],
      [nextCoords[0], nextCoords[2], nextCoords[1], nextCoords[3]]
    ];

  }

  /**
   * Twists by swapping threads 2 over 1 and threads 4 over 3 and returns this order.
   * Swaps the coordinates as well.
   */
  twist(threads, coords) {
    const y_space = 30;
    const x_space = 12;
    if (threads.length < 4 || threads.includes(undefined)) {
      console.error("Invalid thread group passed to twist:", threads);
      return [];
    }

    const thread1 = threads[0].next;
    const thread2 = threads[1].next;
    const thread3 = threads[2].next;

    const thread4 = threads[3].next;

    //2 over 1 and 1 under two
    threads[0].next = thread2;
    threads[1].next = thread1;

    //thread 4 over 3 or 3 under 4
    threads[2].next = thread4;
    threads[3].next = thread3;

    const nextCoords = [];
    //generate new coordinates
    for (let i = 0; i < 4; i++) {
      const [x,y] = coords[i];
      const [x_new, y_new] = [x, y + y_space];
      nextCoords[i] = [x_new,y_new];
    }

    //return the order after the twist
    return [
      [threads[1], threads[0], threads[3], threads[2]],
      [nextCoords[1], nextCoords[0], nextCoords[3], nextCoords[2]]
  ];
  }


}