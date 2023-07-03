import clientPromise from "@/lib/mongodb";

import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@auth0/nextjs-auth0";

type Data = {
  nickname?: string;
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

  const { message } = req.body;

  if (!message || message.length > 17)
    return res.status(422).json({ err: "Maximum 16 charactors." });

  await db.collection(process.env.USERS_COLLECTION_NAME as string).updateOne(
    {
      auth0Id: userSession.user.sub,
    },
    {
      $set: {
        auth0Id: userSession.user.sub,
        nickname: message,
      },
    },
    {
      upsert: true,
    }
  );

  res.status(200).json({ nickname: message });
}
