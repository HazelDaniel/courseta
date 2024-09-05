import express from "express";
import { createServer } from "http";
import { config } from "dotenv";
config({path: ['.env', '.env.dev', '.env.prod']});
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
// import { v1Router } from "./api/v1/routes/root.route.js";
import { v2Router } from './api/v2/routes/root.route.js';
import cors from "cors";
import helmet from "helmet";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "30MB" }));
app.use(express.urlencoded({ extended: true }));
// app.use("/api/v1", v1Router);
app.use("/api/v2", v2Router);

const server = createServer(app);

server.listen(PORT, () => {
  console.log("server started and listening on port", PORT);
});
