import clientPromise from "@/lib/mongodb";

import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@auth0/nextjs-auth0";

type Data = {
  quoteId?: string;
  err?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const userSession = await getSession(req, res);
  const user = userSession?.user;

  if (!user) return res.status(422);

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  if (req.method !== "POST")
    return res.status(405).json({ err: "Method Not Allowed." });

  const { message, userId } = req.body;

  if (!message || message.length > 80) return res.status(422);
  if (!userId) return res.status(422);

  const likes: number = 0;
  const voteList: string[] = [];
  const nickname = user.nickname;

  const dt = new Date();
  const date = dt.toLocaleString();

  const quotes = await db
    .collection(process.env.QUOTES_COLLECTION_NAME as string)
    .find({
      userId: userSession?.user.sub,
    })
    .toArray();

  if (quotes.length > 9)
    return res.status(422).json({ err: "Maximum 10 quotes." });

  const quote = await db
    .collection(process.env.QUOTES_COLLECTION_NAME as string)
    .insertOne({ message, userId, likes, voteList, nickname, date });

  const quoteId = quote.insertedId.toString();

  res.status(200).json({ quoteId });
}
