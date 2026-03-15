import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

const getMongoUri = () => process.env.MONGODB_URI ?? process.env.DATABASE_URL;

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI must be set (or DATABASE_URL for backward compatibility).",
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
    });

    connectionPromise.catch(() => {
      connectionPromise = null;
    });
  }

  return connectionPromise;
};

export { mongoose };

export * from "./schema";
