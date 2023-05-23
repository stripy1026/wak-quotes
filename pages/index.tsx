import { FormEvent, useState } from "react";

import { QuoteTemplate } from "@/components/QuoteTemplate";

export default function Home() {
  const [message, setMessage] = useState("");
  const [quote, setQuote] = useState("");

  const addQuoteMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuote(message);
  };

  return (
    <>
      <h1>WAK QUOTES</h1>
      <QuoteTemplate quote={quote} />
      <form onSubmit={addQuoteMessage}>
        <label>
          <strong>우왁굳이 말하게 하고 싶은 명언은 ?</strong>
        </label>
        <textarea
          className="bg-slate-700"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={80}
        />
        <button type="submit">입력</button>
      </form>
    </>
  );
}
