import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  // Serve the Vite-built frontend. Render runs the server from the repo root,
  // so process.cwd() points to the repo root and this path resolves correctly.
  const staticDir = path.resolve(
    process.cwd(),
    "artifacts/college-website/dist/public",
  );
  app.use(express.static(staticDir));
  // SPA fallback — any route not matched above gets index.html
  app.use((_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
