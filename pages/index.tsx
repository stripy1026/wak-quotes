import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1>WAK QUOTES</h1>
      <Image src="/quote_template.png" width={800} height={450} alt="quote" />
      <div>type quote form here</div>
    </>
  );
}
