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
    return res.status(422).json({ err: "Maximum 12 characters." });

  const userCollection = db.collection(
    process.env.USERS_COLLECTION_NAME as string
  );

  const users = await userCollection.find().toArray();

  if (users.find((user) => user.nickname === message))
    return res.status(422).json({ err: "Nickname duplicated" });

  const previousUpdate = users.find(
    (user) => user.auth0Id === userSession.user.sub
  );
  const currentDate = new Date();

  if (previousUpdate && previousUpdate.dateNicknameChanged) {
    const lastUpdateDate = previousUpdate.dateNicknameChanged;
    const timeSinceLastUpdate =
      currentDate.getTime() - lastUpdateDate.getTime();
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // const oneDayInMillis = 1000; // for debugging

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
