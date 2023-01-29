import express, { Request, Response, Application, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import {
  signupController,
  signinController,
  refreshTokenController,
  resetPasswordController,
} from "./controllers/auth.controller";
import { initializeFirebase } from "./services/auth.service";

const app: Application = express();
const port = process.env.PORT || 3000;
const allowedCors = process.env.ALLOWED_CORS || "http://localhost:8080";
const corsOptions = {
  origin: allowedCors,
  exposedHeaders: ["Authorization", "F-Token"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req: Request, res: Response) => res.send("Hello World"));
app.post("/signup", signupController);
app.post("/signin", signinController);
app.post("/refresh", refreshTokenController);
app.post("/reset", resetPasswordController);

app.use((req, res) => {
  res.status(404).send({ error: "Route not found" });
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

initializeFirebase();

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down server...");
  server.close(() => {
    console.log("Server stopped accepting new connections");
  });

  // Wait for existing connections to close
  server.on("close", () => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down server...");
  server.close(() => {
    console.log("Server stopped accepting new connections");
  });

  // Wait for existing connections to close
  server.on("close", () => {
    console.log("Server closed");
    process.exit(0);
  });
});

function logErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err.message);
  console.log("Path: ", req.path);
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

interface CustomError extends Error {
  status: number;
}

function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
}
