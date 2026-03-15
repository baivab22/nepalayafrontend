import app from "./app";
import { connectToDatabase } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const bootstrap = async () => {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
