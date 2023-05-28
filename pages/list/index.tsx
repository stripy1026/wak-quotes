import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";
import { QuoteTemplate } from "@/components/QuoteTemplate";
import Link from "next/link";

type ListProps = {
  quotes: {
    id: string;
    message: string;
  }[];
};

export default function List({ quotes }: ListProps) {
  return (
    <>
      <h1> This is List Page</h1>
      <ul>
        {quotes.map((quote) => (
          <Link key={quote.id} href={`/list/${quote.id}`}>
            <QuoteTemplate width={400} quote={quote.message} />
          </Link>
        ))}
      </ul>
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
        id: quote._id.toString(),
        message: quote.message,
      })),
    },
  };
};
