import clientPromise from "@/lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  quoteId?: string;
  err?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  if (req.method !== "POST")
    return res.status(405).json({ err: "Method Not Allowed." });

  const { message, userId } = req.body;

  if (!message || message.length > 80) return res.status(422);
  if (!userId) return res.status(422);

  const likes: number = 0;

  const quote = await db
    .collection(process.env.QUOTES_COLLECTION_NAME as string)
    .insertOne({ message, userId, likes });

  const quoteId = quote.insertedId.toString();

  res.status(200).json({ quoteId });
}
