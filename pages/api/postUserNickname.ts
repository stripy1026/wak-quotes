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

  if (!message || message.length > 13)
    return res.status(422).json({ err: "Maximum 16 characters." });

  const userCollection = db.collection(
    process.env.USERS_COLLECTION_NAME as string
  );

  const currentDate = new Date();
  const previousUpdate = await userCollection.findOne({
    auth0Id: userSession.user.sub,
  });

  if (previousUpdate && previousUpdate.dateNicknameChanged) {
    const lastUpdateDate = previousUpdate.dateNicknameChanged;
    const timeSinceLastUpdate =
      currentDate.getTime() - lastUpdateDate.getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timeSinceLastUpdate < oneDayInMillis) {
      return res
        .status(429)
        .json({ err: "Update limit exceeded. Try again tomorrow." });
    }
  }

  await userCollection.updateOne(
    { auth0Id: userSession.user.sub },
    {
      $set: {
        auth0Id: userSession.user.sub,
        nickname: message,
        dateNicknameChanged: currentDate,
      },
    },
    {
      upsert: true,
    }
  );

  res.status(200).json({ nickname: message });
}
