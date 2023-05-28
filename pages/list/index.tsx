import { GetServerSideProps } from "next";

import clientPromise from "@/lib/mongodb";
import { QuoteTemplate } from "@/components/QuoteTemplate";
import Link from "next/link";
import { useRouter } from "next/router";

type ListProps = {
  quotes: {
    id: string;
    message: string;
  }[];
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

  // return (
  //   <>
  //     <h1> This is List Page</h1>
  //     <ul>
  //       {quotes.map((quote) => (
  //         <div key={quote.id}>
  //           <Link href={`/list/${quote.id}`}>
  //             <QuoteTemplate width={400} quote={quote.message} />
  //           </Link>
  //           <button onClick={() => handleDeleteQuote(quote.id)}>Delete</button>
  //         </div>
  //       ))}
  //     </ul>
  //   </>
  // );

  // chatGPT styles
  return (
    <div className="p-4">
      <ul>
        {quotes.map((quote) => (
          <div className="mb-4" key={quote.id}>
            <Link href={`/list/${quote.id}`}>
              <QuoteTemplate width={400} quote={quote.message} />
            </Link>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDeleteQuote(quote.id)}
            >
              Delete
            </button>
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
