import Image from "next/image";

type QuoteTemplateProps = {
  width?: number;
  quote: string;
};

export const QuoteTemplate = ({ width = 800, quote }: QuoteTemplateProps) => {
  const height = (width * 450) / 800;
  const textSize = width <= 400 ? "text-2xl" : "text-4xl";
  const marginX = width <= 400 ? "mr-2" : "mr-10";

  return (
    <div className="relative inline-block">
      <Image
        src="/quote_template.png"
        width={width}
        height={height}
        alt="quote"
      />
      <span
        className={`absolute ${marginX} top-1/3 left-2/3 text-white ${textSize} font-bold text-center`}
      >
        {quote}
      </span>
    </div>
  );
};
