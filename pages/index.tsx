import { FormEvent, useState } from "react";

import { QuoteTemplate } from "@/components/QuoteTemplate";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const [message, setMessage] = useState("");
  const [quote, setQuote] = useState("");
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleaddQuoteMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return; // just show quote in main page

    setQuote(message);
    try {
      const response = await fetch(`api/postQuote`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ message, userId: user.sub }),
      });
      const { quoteId } = await response.json();
      if (quoteId) router.push(`/list/${quoteId}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1 className="text-5xl my-2 font-bold text-center">WAK QUOTES</h1>
      <QuoteTemplate quote={quote} />
      <form onSubmit={handleaddQuoteMessage}>
        <label className="block mt-4">
          <strong>우왁굳이 말하게 하고 싶은 명언은 ?</strong>
        </label>
        <textarea
          className="bg-slate-700 block w-full p-2 mt-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={80}
          placeholder="80자 이내로 입력하세요"
        />
        <button
          type="submit"
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 float-right"
        >
          입력
        </button>
      </form>
    </>
  );
}
