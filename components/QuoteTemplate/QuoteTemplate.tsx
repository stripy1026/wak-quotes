import Image from "next/image";

type QuoteTemplateProps = {
  width?: number;
  quote: string;
};

export const QuoteTemplate = ({ width = 800, quote }: QuoteTemplateProps) => {
  const height = (width * 450) / 800;
  return (
    <>
      <Image
        src="/quote_template.png"
        width={width}
        height={height}
        alt="quote"
      />
      <div>{quote}</div>
    </>
  );
};
