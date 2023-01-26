import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.get("/", (req: Request, res: Response) => res.send("Hello World"));

const port = process.env.PORT || 3000;
const allowedCors = process.env.ALLOWED_CORS || "http://localhost:8080";

const corsOptions = {
  origin: allowedCors,
};
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
