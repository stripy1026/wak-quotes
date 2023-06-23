import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";
import { QuoteTemplate } from "@/components/QuoteTemplate";
import Link from "next/link";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0/client";
import { FormEvent, useState } from "react";

type ListProps = {
  quotes: {
    id: string;
    message: string;
    likes: number;
    voteList: string[];
    nickname: string;
  }[];
};

export default function Ranking({ quotes }: ListProps) {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const [listQuotes, setListQuotes] = useState(quotes);
  const [message, setMessage] = useState("");
  const [searchOption, setSearchOption] = useState("quote");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleSearchQuotes = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchOption === "quote") {
      setListQuotes(quotes.filter((quote) => quote.message.includes(message)));
    } else if (searchOption === "nick") {
      setListQuotes(quotes.filter((quote) => quote.nickname.includes(message)));
    }
  };

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
      <form className="flex mb-2" onSubmit={handleSearchQuotes}>
        <textarea
          className="flex-1 bg-slate-700 w-full h-10 mx-2 mt-2 p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={80}
          placeholder="80자 이내 검색"
        />
        <select
          className="flex-none bg-slate-700 mt-2 mr-2"
          name="search"
          id="ranking-search"
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
        >
          <option value="quote">명언</option>
          <option value="nick">작성자</option>
        </select>
        <button
          type="submit"
          className="flex-none px-4 py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 float-right"
        >
          입력
        </button>
      </form>
      <ul>
        {listQuotes.map((quote) => (
          <div className="mb-4 relative" key={quote.id}>
            <Link href={`/list/${quote.id}`}>
              <QuoteTemplate width={350} quote={quote.message} />
            </Link>
            {user && (
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
            )}
            <p>좋아요: {quote.likes}</p>
            <p>작성자: {quote.nickname}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
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
        nickname: quote.nickname,
      })),
    },
  };
};
