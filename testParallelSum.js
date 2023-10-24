const { spawnSync } = require('child_process');

function runParallelSum(numThreads) {
  const result = spawnSync('node', ['parallelSum.js'], {
    env: { ...process.env, NUM_THREADS: numThreads },
  });

  return result.stdout.toString();
}

function runTests() {
  const testCases = [1, 2, 4]; // Тестирование для 1, 2 и 4 потоков

  testCases.forEach((numThreads) => {
    console.log(`Testing with ${numThreads} thread(s):`);
    const output = runParallelSum(numThreads);
    console.log(output);
  });
}

runTests();
