import { QuoteTemplate } from "@/components/QuoteTemplate";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1>WAK QUOTES</h1>
      <QuoteTemplate quote="깨지고 부숴져라" />
      <form>
        <label>
          <strong>우왁굳이 말하게 하고 싶은 명언은 ?</strong>
        </label>
        <textarea maxLength={80} />
      </form>
    </>
  );
}
