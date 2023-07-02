import { Session, handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

const afterCallback = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  res.setHeader("Location", "/profile");
  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status(500).end();
    }
  },
});
