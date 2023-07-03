import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import clientPromise from "@/lib/mongodb";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

import { QuoteTemplate } from "@/components/QuoteTemplate";

import { Quotes } from "@/types/Quotes";

type ListProps = {
  quotes: Quotes[];
};

export default function List({ quotes }: ListProps) {
  const router = useRouter();

  const handleDeleteQuote = async (quoteId: string) => {
    try {
      const response = await fetch(`api/deleteQuote`, {
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
    <div className="list p-4">
      <ul className="mr-20">
        {quotes.map((quote) => (
          <div className="mb-4 relative" key={quote.id}>
            <Link href={`/list/${quote.id}`}>
              <QuoteTemplate width={350} quote={quote.message} />
            </Link>
            <button
              className="absolute top-2/3 -right-20 bg-red-700 text-white ml-2 px-4 py-2 rounded"
              onClick={() => handleDeleteQuote(quote.id)}
            >
              삭제
            </button>
            <p>좋아요: {quote.likes}</p>
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

    if (!userSession) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const quotes = await db
      .collection(process.env.QUOTES_COLLECTION_NAME as string)
      .find({
        userId: userSession?.user.sub,
      })
      .toArray();

    if (!quotes) {
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
      props: {
        quotes: quotes.map((quote) => ({
          id: quote._id.toString(),
          message: quote.message,
          likes: quote.likes,
          voteList: quote.voteList,
          nickname: user.nickname,
          date: JSON.parse(JSON.stringify(quote.date)),
        })),
      },
    };
  },
});
