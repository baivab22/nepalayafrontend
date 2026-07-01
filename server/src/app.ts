// // import express, { type Express } from "express";
// // import cors from "cors";
// // import path from "path";
// // import { fileURLToPath } from "url";
// // import router from "./routes";

// // const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // const app: Express = express();

// // // Get allowed origins from environment
// // const getAllowedOrigins = () => {
// //   const isDev = process.env.NODE_ENV === "development";
// //   const frontendUrl = process.env.FRONTEND_URL;
  
// //   if (isDev) {
// //     // Development: allow localhost variants
// //     return ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
// //   }
  
// //   // Production: use FRONTEND_URL or default to allow all
// //   return frontendUrl ? [frontendUrl] : ["*"];
// // };

// // // CORS middleware with environment-aware origins
// // app.use(
// //   cors({
// //     origin: getAllowedOrigins(),
// //     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// //     allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
// //     exposedHeaders: ['Content-Type', 'Authorization'],
// //     credentials: true,
// //   })
// // );

// // // Manual CORS headers as fallback
// // app.use((req, res, next) => {
// //   const origins = getAllowedOrigins();
// //   const origin = req.headers.origin || '*';
  
// //   if (origins.includes('*') || origins.includes(origin)) {
// //     res.header('Access-Control-Allow-Origin', origin);
// //   }
  
// //   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
// //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
// //   res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');
  
// //   if (req.method === 'OPTIONS') {
// //     res.sendStatus(204);
// //     return;
// //   }
// //   next();
// // });

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // app.use("/api", router);

// // // Serve frontend static files
// // const staticDir =
// //   process.env.NODE_ENV === "production"
// //     ? path.resolve(__dirname, "public") // In production: dist/public (built alongside server)
// //     : path.resolve(process.cwd(), "../client/dist/public"); // In development: ../client/dist/public from server root

// // app.use(express.static(staticDir));

// // // SPA fallback - serve index.html for any unmatched route
// // app.use((_req, res) => {
// //   res.sendFile(path.join(staticDir, "index.html"));
// // });

// // export default app;


// import express, { type Express } from "express";
// import cors from "cors";
// import router from "./routes";

// const app: Express = express();

// // Get allowed origins from environment
// const getAllowedOrigins = () => {
//   const isDev = process.env.NODE_ENV === "development";
//   const frontendUrl = process.env.FRONTEND_URL;
  
//   if (isDev) {
//     // Development: allow localhost variants
//     return ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
//   }
  
//   // Production: use FRONTEND_URL or default to allow all
//   return frontendUrl ? [frontendUrl] : ["*"];
// };

// // CORS middleware with environment-aware origins
// app.use(
//   cors({
//     origin: getAllowedOrigins(),
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
//     exposedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   })
// );

// // Manual CORS headers as fallback
// app.use((req, res, next) => {
//   const origins = getAllowedOrigins();
//   const origin = req.headers.origin || '*';
  
//   if (origins.includes('*') || origins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
  
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
//   res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');
  
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(204);
//     return;
//   }
//   next();
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // API routes only
// app.use("/api", router);

// // Health check endpoint (optional but recommended)
// app.get("/health", (_req, res) => {
//   res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
// });

// // 404 handler for API routes
// app.use("/api/*", (_req, res) => {
//   res.status(404).json({ error: "API endpoint not found" });
// });

// export default app;

import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import router from "./routes";

const app: Express = express();

const uploadsBase = path.resolve(process.env.UPLOAD_DIR || process.cwd(), "uploads");
if (!fs.existsSync(uploadsBase)) fs.mkdirSync(uploadsBase, { recursive: true });

// Get allowed origins from environment
const getAllowedOrigins = (): string[] => {
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
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'x-admin-password'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Manual OPTIONS preflight handler (cors v2 + Express 5 can be unreliable)
app.use((req: Request, res: Response, next: NextFunction): void => {
  if (req.method !== 'OPTIONS') { next(); return; }
  const origins = getAllowedOrigins();
  const origin = req.headers.origin || '';
  if (origins.includes('*') || origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept, x-admin-password');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional but helpful)
app.use((req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API routes
app.use("/api", router);

// Health check endpoint
app.get("/health", (_req: Request, res: Response): void => {
  const dbState = mongoose.connection.readyState;
  const dbStatus: Record<number, string> = {
    0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting",
  };
  const healthy = dbState === 1;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: dbStatus[dbState] || "unknown",
  });
});

// 404 handler for API routes
app.use((req: Request, res: Response, next: NextFunction): void => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      error: "API endpoint not found",
      path: req.path,
      method: req.method
    });
  } else {
    next();
  }
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
  console.error(err.stack);
  
  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

export default app;