import { GetServerSideProps } from "next";
import Link from "next/link";

import { FormEvent, useEffect, useState } from "react";

import clientPromise from "@/lib/mongodb";
import { useUser } from "@auth0/nextjs-auth0/client";

import { QuoteTemplate } from "@/components/QuoteTemplate";

import { Quotes } from "@/types/Quotes";
import Error from "next/error";
import { Seo } from "@/components/Seo";

const QUOTES_PER_PAGE = 6;

type ListProps = {
  quotes: Quotes[];
};

export default function Ranking({ quotes }: ListProps) {
  const { user, error, isLoading } = useUser();
  const [listQuotes, setListQuotes] = useState(quotes);
  const [message, setMessage] = useState("");
  const [searchOption, setSearchOption] = useState("quote");
  const [filterOption, setFilterOption] = useState("likes");
  const [pageIndex, setPageIndex] = useState(0);
  const [listIndex, setListIndex] = useState(1);

  const partialQuotes = listQuotes.filter((_, index) => {
    return (
      pageIndex * QUOTES_PER_PAGE <= index &&
      index < QUOTES_PER_PAGE + pageIndex * QUOTES_PER_PAGE
    );
  });
  const totalPage = Math.ceil(listQuotes.length / QUOTES_PER_PAGE);
  const pageListNumber = Array.from(
    {
      length: Math.min(totalPage - (listIndex - 1) * 5, 5),
    },
    (_, i) => i + 1 + (listIndex - 1) * 5
  );

  useEffect(() => {
    // handleFilterChange()
    if (filterOption === "likes") {
      setListQuotes((prev) =>
        [...prev].sort((a, b) => {
          if (a.likes > b.likes) return -1;
          if (a.likes < b.likes) return 1;
          return 0;
        })
      );
    } else if (filterOption === "new") {
      setListQuotes((prev) =>
        [...prev].sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
          return 0;
        })
      );
    }
  }, [filterOption]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleFilterChange = () => {
    if (filterOption === "likes") {
      setListQuotes((prev) =>
        [...prev].sort((a, b) => {
          if (a.likes > b.likes) return -1;
          if (a.likes < b.likes) return 1;
          return 0;
        })
      );
    } else if (filterOption === "new") {
      setListQuotes((prev) =>
        [...prev].sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
          return 0;
        })
      );
    }
  };

  const handleSearchQuotes = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchOption === "quote") {
      setListQuotes(quotes.filter((quote) => quote.message.includes(message)));
    } else if (searchOption === "nick") {
      setListQuotes(quotes.filter((quote) => quote.nickname.includes(message)));
    }
    handleFilterChange();
    setListIndex(1);
    setPageIndex(0);
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
        setListQuotes((prevQuotes) => {
          const updatedQuotes = prevQuotes.map((quote) => {
            if (quote.id === quoteId) {
              return {
                ...quote,
                likes: quote.likes + 1,
                voteList: [...quote.voteList, user?.sub as string],
              };
            }
            return quote;
          });
          return updatedQuotes;
        });
      }
    } catch (e) {
      return <Error statusCode={404} />;
    }
  };

  return (
    <>
      <Seo title="Ranking" metaContent="우왁굳 명언 랭킹" />
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
        <select
          className=" bg-slate-700 my-2 mr-2"
          name="filter"
          id="ranking-filter"
          value={filterOption}
          onChange={(e) => {
            setFilterOption(e.target.value);
          }}
        >
          <option value="likes">추천순</option>
          <option value="new">최신순</option>
        </select>
        <div className="list">
          <ul className="mr-20">
            {partialQuotes.map((quote) => (
              <div className="mb-4 relative" key={quote.id}>
                <Link href={`/list/${quote.id}`}>
                  <QuoteTemplate width={350} quote={quote.message} />
                </Link>
                {user && (
                  <button
                    className={`absolute top-2/3  ${
                      quote.voteList.includes(user.sub as string)
                        ? ` bg-blue-700/20 text-white/20`
                        : `bg-blue-700 text-white`
                    } ml-2 px-4 py-2 rounded w-16`}
                    disabled={quote.voteList.includes(user.sub as string)}
                    onClick={() => handlePostLikesQuote(quote.id)}
                  >
                    킹아
                  </button>
                )}
                <p>좋아요: {quote.likes}</p>
                <p>작성자: {quote.nickname}</p>
              </div>
            ))}
          </ul>
        </div>
        <div className="text-center bg-blue-900/40">
          <button
            className="mx-2"
            onClick={() =>
              setListIndex((prev) => {
                if (prev > 1) return --prev;
                return prev;
              })
            }
          >
            {"<"}
          </button>
          {pageListNumber.map((num) => (
            <button
              className={`px-1 mx-4 my-2 ${
                pageIndex === num - 1 && "text-zinc-600"
              }`}
              onClick={() => setPageIndex(num - 1)}
              key={num}
            >
              {num}
            </button>
          ))}
          <button
            className="mx-2"
            onClick={() =>
              setListIndex((prev) => {
                if (prev * 5 < totalPage) return ++prev;
                return prev;
              })
            }
          >
            {">"}
          </button>
        </div>
      </div>
    </>
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

  const users = await db
    .collection(process.env.USERS_COLLECTION_NAME as string)
    .find()
    .toArray();

  if (!users) {
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
        nickname: users.find((user) => user.auth0Id === quote.userId)?.nickname,
        date: JSON.parse(JSON.stringify(quote.date)),
      })),
    },
  };
};
