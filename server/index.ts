import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { config } from "dotenv";
config();
const PORT = process.env.PORT || 3000;
import { v1Router } from "./api/v1/routes/root.route.js";
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", v1Router);
const server = createServer(app);

server.listen(PORT, () => {
  console.log("server started and listening on port", PORT);
});
