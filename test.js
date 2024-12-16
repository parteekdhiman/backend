const autocannon = require('autocannon');

async function runLoadTest() {
  try {
    // Adjusted parameters for a more reasonable load test
    const result = await autocannon({
      url: 'http://localhost:9000/api/crud',
      connections: 1000, // A smaller number to avoid overwhelming the system
      pipelining: 100,   // You can adjust pipelining to simulate multiple requests
      duration: 10       // Duration of the test in seconds
    });

    // Output the results
    console.log(result);
  } catch (error) {
    console.error("Error during load test:", error);
  }
}

// Run the test
runLoadTest();
