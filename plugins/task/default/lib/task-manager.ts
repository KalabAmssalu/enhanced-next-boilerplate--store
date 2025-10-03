import { task } from "@KalabAmssalu/task";

// Task manager for handling multiple tasks
export class TaskManager {
  private tasks: Map<string, any> = new Map();

  async startTask(
    name: string,
    options?: {
      successMessage?: string;
      maxLines?: number;
      noClear?: boolean;
    }
  ) {
    const taskInstance = await task.startTask({
      name,
      ...options,
    });

    this.tasks.set(name, taskInstance);
    return taskInstance;
  }

  async completeTask(name: string, message?: string) {
    const taskInstance = this.tasks.get(name);
    if (taskInstance) {
      taskInstance.stop(message);
      this.tasks.delete(name);
    }
  }

  getTask(name: string) {
    return this.tasks.get(name);
  }

  getAllTasks() {
    return Array.from(this.tasks.keys());
  }
}

// Export singleton instance
export const taskManager = new TaskManager();

// Export task functions for direct use
export { task };

// Helper functions for common task patterns
export const runTask = async (
  name: string,
  taskFunction: (task: any) => Promise<void> | void,
  options?: {
    successMessage?: string;
    maxLines?: number;
    noClear?: boolean;
  }
) => {
  const taskInstance = await task.startTask({ name, ...options });

  try {
    await taskFunction(taskInstance);
    taskInstance.stop(
      options?.successMessage || `${name} completed successfully`
    );
  } catch (error) {
    taskInstance.error(`Error in ${name}: ${error}`);
    taskInstance.stop(`${name} failed`);
    throw error;
  }
};
