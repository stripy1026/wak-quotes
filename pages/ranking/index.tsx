import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";
import { QuoteTemplate } from "@/components/QuoteTemplate";
import Link from "next/link";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0/client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";

type ListProps = {
  quotes: {
    id: string;
    message: string;
    likes: number;
    voteList: string[];
  }[];
};

export default function Ranking({ quotes }: ListProps) {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  if (!user) return <div>There is no user</div>;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

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
              className={`absolute top-2/3 -right-20  ${
                quote.voteList.includes(user.sub as string)
                  ? ` bg-blue-700/20 text-white/20`
                  : `bg-blue-700 text-white`
              }  ml-2 px-4 py-2 rounded `}
              disabled={quote.voteList.includes(user.sub as string)}
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
  async getServerSideProps() {
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
          voteList: quote.voteList,
        })),
      },
    };
  },
});
