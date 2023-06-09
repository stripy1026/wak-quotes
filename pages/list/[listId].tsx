import { GetServerSideProps } from "next";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

import { QuoteTemplate } from "@/components/QuoteTemplate";

import { Quotes } from "@/types/Quotes";
import { Seo } from "@/components/Seo";

export default function ListId({ message, likes, nickname, date }: Quotes) {
  return (
    <>
      <Seo title="Quote" metaContent={message} />
      <div className="my-4">
        <QuoteTemplate quote={message} />
        <p>좋아요 : {likes}</p>
        <p>작성자 : {nickname}</p>
        <p>작성일 : {new Date(date).toLocaleString()}</p>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const listId: string = ctx.query.listId as string;
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const quote = await db
    .collection(process.env.QUOTES_COLLECTION_NAME as string)
    .findOne({ _id: new ObjectId(listId) });

  if (!quote) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const user = await db
    .collection(process.env.USERS_COLLECTION_NAME as string)
    .findOne({
      auth0Id: quote.userId,
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
    props: {
      id: quote._id.toString(),
      message: quote.message,
      likes: quote.likes,
      voteList: quote.voteList,
      nickname: user.nickname,
      date: JSON.parse(JSON.stringify(quote.date)),
    },
  };
};
