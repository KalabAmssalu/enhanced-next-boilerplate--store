import { taskManager, runTask } from "./task-manager";

async function demonstrateTasks() {
  // Example 1: Simple task
  console.log("=== Example 1: Simple Task ===");
  const task1 = await taskManager.startTask("Processing Files");

  for (let i = 1; i <= 5; i++) {
    task1.log(`Processing file ${i}/5`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await taskManager.completeTask(
    "Processing Files",
    "All files processed successfully!"
  );

  // Example 2: Task with errors and warnings
  console.log("\n=== Example 2: Task with Errors and Warnings ===");
  const task2 = await taskManager.startTask("Data Validation");

  task2.info("Starting data validation...");
  await new Promise((resolve) => setTimeout(resolve, 300));

  task2.warn("Found 3 warnings in the data");
  await new Promise((resolve) => setTimeout(resolve, 300));

  task2.error("Critical error: Invalid data format");
  await new Promise((resolve) => setTimeout(resolve, 300));

  task2.success("Validation completed with issues");
  await taskManager.completeTask("Data Validation", "Data validation finished");

  // Example 3: Using runTask helper
  console.log("\n=== Example 3: Using runTask Helper ===");
  await runTask(
    "Database Migration",
    async (task) => {
      task.info("Connecting to database...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      task.log("Running migration scripts...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      task.success("Migration completed successfully");
    },
    {
      successMessage: "Database migration finished successfully!",
      maxLines: 5,
    }
  );

  // Example 4: Multiple concurrent tasks
  console.log("\n=== Example 4: Multiple Concurrent Tasks ===");
  const task3 = await taskManager.startTask("API Setup");
  const task4 = await taskManager.startTask("Frontend Build");

  // Simulate concurrent work
  const promises = [
    (async () => {
      for (let i = 1; i <= 3; i++) {
        task3.log(`Setting up API endpoint ${i}`);
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      await taskManager.completeTask("API Setup", "API setup completed");
    })(),
    (async () => {
      for (let i = 1; i <= 3; i++) {
        task4.log(`Building component ${i}`);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      await taskManager.completeTask(
        "Frontend Build",
        "Frontend build completed"
      );
    })(),
  ];

  await Promise.all(promises);
}

// Run the demonstration
demonstrateTasks().catch(console.error);
