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
import { initializeFirebase } from "./services/initializeFirebase";
import { getPort, getAllowedCors } from "./util/envVars";

const app: Application = express();
const port = getPort();
const allowedCors = getAllowedCors() || "http://localhost:8080";
const corsOptions = {
  origin: allowedCors,
  exposedHeaders: ["Authorization", "F-Token"],
};

app.use(cors(corsOptions));
app.use(express.json());

initializeFirebase();

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

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on("error", (err) => {
  console.log("error");
  console.log(err.message);
  server.close(() => {
    console.log("closing server");
  });

  server.on("close", () => {
    console.log("Server closed");
    process.exit(1);
  });
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down server...");
  server.close(() => {
    console.log("Server stopped accepting new connections");
  });

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

function errorHandler(err: CustomError, req: Request, res: Response) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
}
