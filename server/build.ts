import path from "path";
import { fileURLToPath } from "url";
import { build as esbuild } from "esbuild";
import { mkdir, rm, readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowlist = [
  "cors",
  "express",
  "multer",
  "nodemailer",
  "zod",
];

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
  await buildServer();
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
