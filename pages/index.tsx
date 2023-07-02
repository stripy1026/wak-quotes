import { FormEvent, useState } from "react";

import { QuoteTemplate } from "@/components/QuoteTemplate";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const [message, setMessage] = useState("");
  const [quote, setQuote] = useState("");

  const router = useRouter();
  const { user, error, isLoading } = useUser();

  const [maxQuotes, setMaxQuotes] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleaddQuoteMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setQuote(message);

    if (!user) return;

    try {
      const response = await fetch(`api/postQuote`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message, userId: user.sub }),
      });
      const { quoteId, err } = await response.json();
      if (err === "Maximum 10 quotes.") return setMaxQuotes(true);
      if (quoteId) router.push(`/list/${quoteId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1 className="text-5xl my-4 font-bold text-center">
        우왁굳 명언 만들기
      </h1>
      <QuoteTemplate quote={quote} />
      <form onSubmit={handleaddQuoteMessage}>
        <label className="block mt-4">
          <strong>우왁굳이 말하게 하고 싶은 명언은 ?</strong>
        </label>
        <textarea
          className="bg-slate-700 block w-full p-2 mt-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={40}
          placeholder="40자 이내로 입력하세요"
        />
        <button
          type="submit"
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 float-right"
        >
          입력
        </button>
        {maxQuotes && (
          <p className="text-red-700">10개 이상의 명언은 저장되지 않습니다!</p>
        )}
      </form>
    </>
  );
}
