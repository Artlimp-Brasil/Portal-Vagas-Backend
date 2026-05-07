import { env } from "./config/env.js";
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import applicationsRoutes from "./routes/applications.routes.js";

const app = express();

app.use(cors({
  origin: env.frontendUrl,
}));

app.use(fileUpload());
app.use(express.json());

app.use("/api/", applicationsRoutes);

app.listen(env.port, () => {
  console.log(`Servidor rodando em http://localhost:${env.port}`);
});