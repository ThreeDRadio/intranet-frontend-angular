import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Defines the global window and document objects
    environment: "jsdom",
  },
});
