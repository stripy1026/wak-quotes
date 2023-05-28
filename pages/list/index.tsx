import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";

type ListProps = {
  quotes: string[];
};

export default function List({ quotes }: ListProps) {
  return (
    <>
      <h1> This is List Page</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const quotes = await db
    .collection(process.env.QUOTES_COLLECTION_NAME as string)
    .find()
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
      quotes: quotes.map((quote) => ({
        message: quote.message,
      })),
    },
  };
};
