import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Event listeners can be added here
    },
    baseUrl: "http://localhost:5173/", 
    supportFile: false,
  },
});
