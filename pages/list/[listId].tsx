import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";

import { QuoteTemplate } from "@/components/QuoteTemplate";
import { ObjectId } from "mongodb";

type ListIdProps = {
  message: string;
};

export default function ListId({ message }: ListIdProps) {
  return (
    <>
      <h3>This is ListId page</h3>
      <QuoteTemplate quote={message} />
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
    props: { message: quote.message },
  };
};
