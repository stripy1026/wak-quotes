import clientPromise from "@/lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message?: string;
  err?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  if (req.method !== "GET")
    return res.status(405).json({ err: "Method Not Allowed." });

  const { insertedId } = req.body;

  if (!insertedId) return res.status(422);

  const quote = await db
    .collection(process.env.QUOTES_COLLECTION_NAME as string)
    .findOne({ insertedId });

  res.status(200).json({ quote.message });
}
