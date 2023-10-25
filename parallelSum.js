const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

function calculateSum(arr, start, end) {
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += arr[i];
  }
  return sum;
}

if (isMainThread) {
  const numThreads = 4; 
  const arraySize = 1000000;

  const inputArray = new Array(arraySize).fill(Math.floor(Math.random() * 1000) + 1); 

  const chunkSize = Math.ceil(arraySize / numThreads);
  const workers = [];

  for (let i = 0; i < numThreads; i++) {
    const start = i * chunkSize;
    const end = Math.min((i + 1) * chunkSize, arraySize);

    const worker = new Worker(__filename, {
      workerData: {
        arr: inputArray,
        start,
        end,
      },
    });

    workers.push(worker);

    worker.on('message', (message) => {
      console.log(`Thread ${i + 1} sum: ${message}`);
    });
  }

  let totalSum = 0;
  const startTime = Date.now();

  Promise.all(
    workers.map((worker) => {
      return new Promise((resolve) => {
        worker.on('message', (message) => {
          totalSum += message;
          resolve();
        });
      });
    })
  ).then(() => {
    const endTime = Date.now();
    console.log(`Total sum: ${totalSum}`);
    console.log(`Time taken: ${endTime - startTime} ms`);
  });
} else {
  const { arr, start, end } = workerData;
  const sum = calculateSum(arr, start, end);
  parentPort.postMessage(sum);
}
