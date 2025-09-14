import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'university_portal';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env')
}

type ConnectionObject = {
   isConnected?: number;
}

const connection: ConnectionObject = {}

export async function dbConnect(): Promise<void> {
   if (connection.isConnected) {
      console.log("Already connected to MongoDB");
      return;
   }

   try {
      const db = await mongoose.connect(uri || '', {
         dbName: dbName,
      });

      connection.isConnected = db.connections[0].readyState;
      console.log(`Connected to MongoDB database: ${dbName}`);
   } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
   }
}
