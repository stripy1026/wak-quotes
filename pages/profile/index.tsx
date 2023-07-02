import { GetServerSideProps } from "next";

import { useState } from "react";

import clientPromise from "@/lib/mongodb";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

type TmpProp = {
  nickname: string;
};

export default function Profile({ nickname }: TmpProp) {
  const [message, setMessage] = useState("");

  const handleChangeNickname = () => {};

  return (
    <>
      <div className="my-20 text-4xl">닉네임: {nickname}</div>
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

    console.log(userSession?.user);

    const quotes = await db
      .collection(process.env.QUOTES_COLLECTION_NAME as string)
      .find({
        userId: userSession?.user.sub,
      })
      .toArray();

    if (quotes === null) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        nickname: userSession?.user.nickname,
      },
    };
  },
});
