import Image from "next/image";

type QuoteTemplateProps = {
  width?: number;
  quote: string;
};

export const QuoteTemplate = ({ width = 700, quote }: QuoteTemplateProps) => {
  const height = (width * 350) / 700;
  const textSize = width <= 350 ? "text-xl" : "text-4xl";
  const marginX = width <= 350 ? "mx-2" : "mx-10";

  return (
    <div className="relative inline-block">
      <Image
        src="/quote_template.png"
        width={width}
        height={height}
        alt="quote"
      />
      <span
        className={`absolute ${marginX} top-1/3 left-1/2 text-white ${textSize} ${
          width > 350 && "font-bold"
        } font-serif text-center`}
      >
        {`"${quote}"`}
      </span>
    </div>
  );
};
