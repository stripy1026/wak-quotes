import { GetServerSideProps } from "next";

import { FormEvent, useState } from "react";

import clientPromise from "@/lib/mongodb";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { QuoteTemplate } from "@/components/QuoteTemplate";

type ProfilePropType = {
  userNickname: string;
};

export default function Profile({ userNickname }: ProfilePropType) {
  const [nickname, setNickname] = useState(userNickname);
  const [message, setMessage] = useState("");
  const [maxNickname, setMaxNickname] = useState(false);

  const handleChangeNickname = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMaxNickname(false);

    try {
      const response = await fetch(`api/postUserNickname`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const { nickname, err } = await response.json();
      if (err === "Maximum 16 charactors.") return setMaxNickname(true);
      if (nickname) setNickname(nickname);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="my-5 text-4xl text-center">닉네임 변경하기</div>
      <QuoteTemplate quote={` '${nickname}' 님, 계세요?`} />
      <form onSubmit={handleChangeNickname}>
        <textarea
          className="bg-slate-700 block w-full p-2 mt-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={20}
          placeholder="변경할 12자 이하의 닉네임을 입력하세요"
        />
        <button
          type="submit"
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 float-right"
        >
          있습니다
        </button>
        {maxNickname && (
          <p className="text-red-500">12자 이상은 불가능합니다!</p>
        )}
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const userCollection = db.collection(
      process.env.USERS_COLLECTION_NAME as string
    );

    if (!userSession) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    await userCollection.updateOne(
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

    const user = await userCollection.findOne({
      auth0Id: userSession.user.sub,
    });

    if (!user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: { userNickname: user.nickname },
    };
  },
});
