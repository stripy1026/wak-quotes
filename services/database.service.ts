import { MongoClient, Collection, Db } from "mongodb";
import * as dotenv from "dotenv";

export const collections: { quotes?: Collection } = {};

export async function connectToDatabase() {
  dotenv.config();

  const client: MongoClient = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  const db: Db = client.db(process.env.DB_NAME);

  const quotesCollection: Collection = db.collection(
    process.env.QUOTES_COLLECTION_NAME
  );

  collections.quotes = quotesCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${quotesCollection.collectionName}`
  );
}
