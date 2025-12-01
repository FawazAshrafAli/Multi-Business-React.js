import { logServerError } from "./server-logger";

if (!global.__SSR_LOGGER_INITIALIZED__) {
  global.__SSR_LOGGER_INITIALIZED__ = true;

  process.on("unhandledRejection", (err) => logServerError(err));
  process.on("uncaughtException", (err) => logServerError(err));

  console.log("SSR global error handlers registered");
}
