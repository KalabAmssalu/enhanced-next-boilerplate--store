import {
  initLogger,
  logInfo,
  logError,
  logSuccess,
  logWarning,
  logDebug,
} from "./logger";

async function demonstrateLogger() {
  // Initialize the logger
  await initLogger();

  // Basic logging examples
  logInfo("Application started successfully");
  logSuccess("Database connection established");
  logWarning("This is a warning message");
  logError("An error occurred during processing");

  // Debug logging (only shows in development)
  logDebug("Debug information for development");

  // Logging with objects
  logInfo("User data:", { id: 1, name: "John Doe", email: "john@example.com" });

  // Logging with multiple arguments
  logSuccess("Operation completed", "in", 250, "milliseconds");
}

// Run the demonstration
demonstrateLogger().catch(console.error);
