import app from "./app";
import { connectToDatabase } from "./db";

const rawPort = process.env["PORT"] ?? "3000";
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
