import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";

import { QuoteTemplate } from "@/components/QuoteTemplate";
import { ObjectId } from "mongodb";

type ListIdProps = {
  message: string;
  likes: number;
  nickname: string;
  date: string;
};

export default function ListId({
  message,
  likes,
  nickname,
  date,
}: ListIdProps) {
  return (
    <>
      <h3>This is ListId page</h3>
      <QuoteTemplate quote={message} />
      <p>likes : {likes}</p>
      <p>작성자 : {nickname}</p>
      <p>작성일 : {date}</p>
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

  if (quote === null) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      message: quote.message,
      likes: quote.likes,
      nickname: quote.nickname,
      date: quote.date,
    },
  };
};
