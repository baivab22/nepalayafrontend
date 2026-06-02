import path from "path";
import { fileURLToPath } from "url";
import { build as esbuild } from "esbuild";
import { cp, mkdir, rm, readFile } from "fs/promises";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times without risking some
// packages that are not bundle compatible
const allowlist = [
  "@google/generative-ai",
  "axios",
  "cors",
  "date-fns",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

function runCommand(command: string, args: string[], cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: false,
    });

    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
      }
    });
  });
}

async function buildFrontend() {
  const clientDir = path.resolve(__dirname, "../client");
  const clientDist = path.resolve(clientDir, "dist/public");
  const serverPublic = path.resolve(__dirname, "dist/public");

  console.log("building frontend...");
  await runCommand("npm", ["run", "build"], clientDir);
  await rm(serverPublic, { recursive: true, force: true });
  await cp(clientDist, serverPublic, { recursive: true });
}

async function buildServer() {
  const distDir = path.resolve(__dirname, "dist");
  await mkdir(distDir, { recursive: true });
  await rm(path.resolve(distDir, "index.cjs"), { force: true });

  console.log("building server...");
  const pkgPath = path.resolve(__dirname, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter(
    (dep) =>
      !allowlist.includes(dep) &&
      !(pkg.dependencies?.[dep]?.startsWith("workspace:")),
  );

  await esbuild({
    entryPoints: [path.resolve(__dirname, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: path.resolve(distDir, "index.cjs"),
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
  });
}

async function buildAll() {
  await buildFrontend();
  await buildServer();
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
