import Image from "next/image";

type QuoteTemplateProps = {
  width?: number;
  height?: number;
  quote: string;
};

export const QuoteTemplate = ({
  width = 800,
  height = 450,
  quote,
}: QuoteTemplateProps) => {
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
