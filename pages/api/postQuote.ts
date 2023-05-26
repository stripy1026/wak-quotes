import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name?: string;
  err?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST")
    return res.status(405).json({ err: "Method Not Allowed." });

  const data = req.body;
  console.log("DATA: ", data);

  res.status(200).json({ name: "John Doe" });
}
