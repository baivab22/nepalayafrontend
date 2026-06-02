import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

// CORS middleware (allow all)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

// Manual CORS headers as fallback (for any missed edge cases)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
  res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve frontend static files
const staticDir =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public") // In production: dist/public (built alongside server)
    : path.resolve(process.cwd(), "../client/dist/public"); // In development: ../client/dist/public from server root

app.use(express.static(staticDir));

// SPA fallback - serve index.html for any unmatched route
app.use((_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

export default app;
