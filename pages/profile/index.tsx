import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

type TmpProp = {
  nickname: string;
};

export default function Profile({ nickname }: TmpProp) {
  return (
    <>
      <div>This is profile</div>
      <div>{nickname}</div>
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
