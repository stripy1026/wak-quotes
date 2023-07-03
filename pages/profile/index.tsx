import { GetServerSideProps } from "next";

import { useState } from "react";

import clientPromise from "@/lib/mongodb";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Profile() {
  const [message, setMessage] = useState("");

  const handleChangeNickname = () => {};

  return (
    <>
      <div className="my-20 text-4xl">닉네임: {}</div>
      <form onSubmit={handleChangeNickname}>
        <label className="block mt-4">
          <strong>닉네임 변경</strong>
        </label>
        <textarea
          className="bg-slate-700 block w-full p-2 mt-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={16}
        />
        <button
          type="submit"
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 float-right"
        >
          변경
        </button>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    if (!userSession) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const user = await db
      .collection(process.env.USERS_COLLECTION_NAME as string)
      .updateOne(
        {
          auth0Id: userSession.user.sub,
        },
        {
          $setOnInsert: {
            auth0Id: userSession.user.sub,
            nickname: userSession.user.nickname,
          },
        },
        {
          upsert: true,
        }
      );

    return {
      props: {},
    };
  },
});
