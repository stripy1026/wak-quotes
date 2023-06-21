import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success?: boolean;
  err?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    if (req.method !== "POST")
      return res
        .status(405)
        .json({ success: false, err: "Method Not Allowed." });

    const { quoteId } = req.body;

    if (!quoteId)
      return res
        .status(422)
        .json({ success: false, err: "Server can't process your request." });

    await db.collection(process.env.QUOTES_COLLECTION_NAME as string).updateOne(
      { _id: new ObjectId(quoteId) },
      {
        $inc: {
          likes: 1,
        },
      }
    );

    res.status(200).json({ success: true });
  } catch (e) {
    console.log("ERROR TRYING TO LIKE: ", e);
  }
}
