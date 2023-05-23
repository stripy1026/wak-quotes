import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1>WAK QUOTES</h1>
      <Image src="/quote_template.png" width={800} height={450} alt="quote" />
      <form>
        <label>
          <strong>우왁굳이 말하게 하고 싶은 명언은 ?</strong>
        </label>
        <textarea maxLength={80} />
      </form>
    </>
  );
}
