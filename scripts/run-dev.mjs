import { spawn } from "child_process";

function start(command, args, label, extraEnv = {}) {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${label}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${label}] ${chunk}`);
  });

  return child;
}

const server = start("npm", ["run", "dev", "--prefix", "server"], "server", {
  PORT: process.env.PORT || "3000",
  NODE_ENV: "development",
});

const client = start("npm", ["run", "dev", "--prefix", "client"], "client");

function shutdown(signal) {
  server.kill(signal);
  client.kill(signal);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

server.on("exit", (code) => {
  if (code !== null && code !== 0) {
    client.kill("SIGTERM");
    process.exit(code);
  }
});

client.on("exit", (code) => {
  if (code !== null && code !== 0) {
    server.kill("SIGTERM");
    process.exit(code);
  }
});
