// lib/server-logger.js
let logServerError;

if (typeof window === "undefined") {
  const fs = require("fs");
  const path = require("path");

  const logFile = path.join(process.cwd(), "ssr-error.log");

  logServerError = (error, context = {}) => {
    try {
      const timestamp = new Date().toISOString();
      const name = error?.name || "Error";
      const message = error?.message || error?.toString() || "Unknown error";

      // Filter stack trace to your code only
      const stack = (error?.stack || "")
        .split("\n")
        .filter(line => !/node_modules|internal/.test(line))
        .join("\n");

      // Build context info string
      let contextInfo = "";
      if (context.page) contextInfo += `Page: ${context.page}\n`;
      if (context.url) contextInfo += `URL: ${context.url}\n`;
      if (context.functionName) contextInfo += `Function: ${context.functionName}\n`;
      if (context.method) contextInfo += `Method: ${context.method}\n`;
      if (context.query) contextInfo += `Query: ${JSON.stringify(context.query)}\n`;
      if (context.params) contextInfo += `Params: ${JSON.stringify(context.params)}\n`;

      // Axios-specific info
      if (error?.isAxiosError) {
        contextInfo += `Axios Config: ${JSON.stringify(error.config || {}, null, 2)}\n`;
        if (error.response) {
          contextInfo += `Axios Response Status: ${error.response.status}\n`;
          contextInfo += `Axios Response Data: ${JSON.stringify(error.response.data, null, 2)}\n`;
          contextInfo += `Axios Response Headers: ${JSON.stringify(error.response.headers, null, 2)}\n`;
        }
      }

      const logEntry = [
        "==================== SSR ERROR ====================",
        `Timestamp: ${timestamp}`,
        `Type: ${name}`,
        `Message: ${message}`,
        contextInfo,
        `Stack:\n${stack || "No relevant stack lines"}`,
        "==================================================\n\n"
      ].join("\n");

      fs.appendFileSync(logFile, logEntry);
    } catch (err) {
      console.error("Failed to write SSR log:", err);
    }
  };
} else {
  logServerError = () => {};
}

module.exports = { logServerError };
