import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";
import { QuoteTemplate } from "@/components/QuoteTemplate";
import Link from "next/link";
import { useRouter } from "next/router";

import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

type ListProps = {
  quotes: {
    id: string;
    message: string;
    likes: number;
  }[];
};

export default function Ranking({ quotes }: ListProps) {
  const router = useRouter();

  const handlePostLikesQuote = async (quoteId: string) => {
    try {
      const response = await fetch(`api/postLikesQuote`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ quoteId }),
      });
      const { success } = await response.json();
      if (success === true) {
        router.replace(router.asPath);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-4">
      <ul>
        {quotes.map((quote) => (
          <div className="mb-4 relative" key={quote.id}>
            <Link href={`/list/${quote.id}`}>
              <QuoteTemplate width={350} quote={quote.message} />
            </Link>
            <button
              className="absolute top-2/3 -right-20 bg-blue-700 text-white ml-2 px-4 py-2 rounded"
              onClick={() => handlePostLikesQuote(quote.id)}
            >
              like
            </button>
            <p>likes: {quote.likes}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const quotes = await db
      .collection(process.env.QUOTES_COLLECTION_NAME as string)
      .find()
      .sort({ likes: -1 })
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
          likes: quote.likes,
        })),
      },
    };
  },
});
