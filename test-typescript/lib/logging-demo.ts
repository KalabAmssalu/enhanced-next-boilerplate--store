import { enhancedLogging } from "./enhanced-logging";

async function demonstrateEnhancedLogging() {
  // Initialize the enhanced logging system
  await enhancedLogging.init();

  console.log("=== Enhanced Logging Demo ===\n");

  // Basic logging
  enhancedLogging.info("Enhanced logging system initialized");
  enhancedLogging.success("System ready for operations");

  // Performance tracking example
  await enhancedLogging.trackPerformance("Data Processing", async () => {
    enhancedLogging.info("Processing large dataset...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    enhancedLogging.success("Dataset processed successfully");
    return { records: 1000, processed: 1000 };
  });

  // Task with logging example
  await enhancedLogging.runTaskWithLogging(
    "Database Migration",
    async (task) => {
      task.info("Connecting to database...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      task.log("Running migration scripts...");
      for (let i = 1; i <= 3; i++) {
        task.log(`Executing migration ${i}/3`);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      task.success("Migration completed successfully");
    },
    {
      successMessage: "Database migration finished!",
      maxLines: 5,
    }
  );

  // Error handling example
  try {
    await enhancedLogging.runTaskWithLogging(
      "Risky Operation",
      async (task) => {
        task.warn("This operation might fail...");
        await new Promise((resolve) => setTimeout(resolve, 200));
        throw new Error("Simulated error for demonstration");
      }
    );
  } catch (error) {
    enhancedLogging.error("Caught expected error:", error);
  }

  // Multiple concurrent operations
  enhancedLogging.info("Starting concurrent operations...");

  const operations = [
    enhancedLogging.trackPerformance("API Call 1", async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { status: "success", data: "response1" };
    }),
    enhancedLogging.trackPerformance("API Call 2", async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return { status: "success", data: "response2" };
    }),
    enhancedLogging.trackPerformance("File Processing", async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return { files: 50, processed: 50 };
    }),
  ];

  const results = await Promise.all(operations);
  enhancedLogging.success("All concurrent operations completed", results);

  enhancedLogging.info("Enhanced logging demonstration completed!");
}

// Run the demonstration
demonstrateEnhancedLogging().catch(console.error);
