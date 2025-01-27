import express from "express";

type Callback<T extends any[]> = (...args: T) => Promise<any>;

class RateLimiter {
  queue: Array<() => Promise<any>> = []; // Queue to store function calls
  private limit: number; // Max number of requests allowed
  private interval: number; // Time window in milliseconds
  private currentRequests: number = 0; // Current number of ongoing requests
  private intervalTimer: NodeJS.Timeout | null = null; // Timer to reset the request limit

  constructor(limit: number, interval: number) {
    this.limit = limit;
    this.interval = interval;
  }

  private processNext() {
    // console.log("process next job", this.queue.length, this.currentRequests);
    // If there are no requests in the queue or current requests reached the limit, do nothing
    if (this.queue.length === 0 || this.currentRequests >= this.limit) {
      return;
    }

    // Dequeue the next function
    const nextCall = this.queue.shift();
    if (!nextCall) {
      return;
    }

    // Increment ongoing requests count
    this.currentRequests++;

    this.setTimer();
    // Call the next function and manage its promise
    nextCall()
      .then(() => {
        // Once resolved, decrement the count and process the next function
        // this.currentRequests--;
        this.processNext(); // Process the next call
      })
      .catch(() => {
        // On error, decrement the count and process the next call
        // this.currentRequests--;
        this.processNext();
      });
  }
  private setTimer() {
    if (this.intervalTimer === null) {
      this.intervalTimer = setTimeout(() => {
        console.log("Clear Interval");
        this.currentRequests = 0; // Reset current requests count
        this.intervalTimer = null;
        this.processNext(); // Process the queue as needed
      }, this.interval);
    }
  }
  public enqueue(callback: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => callback().then(resolve).catch(reject));

      // Start the interval timer if not already running
      this.setTimer();
      // Try to process the first item in the queue
      this.processNext();
    });
  }
}

class A {
  async process1() {
    console.log("calling process 1", new Date().getSeconds());
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // console.log("Process 1 executed");
        resolve("Result from Process 1");
      }, 6500); // Simulate async operation
    });
  }

  async process2() {
    console.log("calling process 2", new Date().getSeconds());
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // console.log("Process 2 executed");
        resolve("Result from Process 2");
      }, 7500); // Simulate async operation
    });
  }
}

// Create an instance of the class A
const aInstance = new A();

// Create a throttler with a limit of 2 calls every 3 seconds
const throttler = new RateLimiter(2, 1000); // Maximum 2 calls every 3 seconds

// Global array to store results
const results: string[] = [];

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (if needed)
app.use(express.json());

// Endpoint to trigger process1
app.post("/process1", async (req, res) => {
  try {
    throttler
      .enqueue(() => aInstance.process1())
      .then((result) => {
        results.push(result); // Store the result in the global array
      });
    res.status(200).json({ message: "Process 1 triggered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing.");
  }
});

// Endpoint to trigger process2
app.post("/process2", async (req, res) => {
  try {
    throttler
      .enqueue(() => aInstance.process2())
      .then((result) => {
        results.push(result); // Store the result in the global array
      });
    res.status(200).json({ message: "Process 2 triggered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing.");
  }
});

// Endpoint to check results
app.get("/results", (req, res) => {
  res.status(200).json({ results, queue: throttler.queue });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
