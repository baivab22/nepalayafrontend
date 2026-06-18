import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

// Get allowed origins from environment
const getAllowedOrigins = () => {
  const isDev = process.env.NODE_ENV === "development";
  const frontendUrl = process.env.FRONTEND_URL;
  
  if (isDev) {
    // Development: allow localhost variants
    return ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
  }
  
  // Production: use FRONTEND_URL or default to allow all
  return frontendUrl ? [frontendUrl] : ["*"];
};

// CORS middleware with environment-aware origins
app.use(
  cors({
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Manual CORS headers as fallback
app.use((req, res, next) => {
  const origins = getAllowedOrigins();
  const origin = req.headers.origin || '*';
  
  if (origins.includes('*') || origins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
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
