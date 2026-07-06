import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        statements: 60,
        branches: 40,
        functions: 50,
        lines: 65,
      },
    },
  },
});
