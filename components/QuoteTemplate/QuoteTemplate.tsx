import Image from "next/image";

type QuoteTemplateProps = {
  width?: number;
  quote: string;
};

export const QuoteTemplate = ({ width = 800, quote }: QuoteTemplateProps) => {
  const height = (width * 450) / 800;
  const textSize = width <= 400 ? "text-2xl" : "text-4xl";
  const translate =
    width <= 400
      ? "transform translate-x-3/4 translate-y-1/2"
      : "transform translate-x-1/2 translate-y-1/2";
  return (
    <div className="relative inline-block">
      <Image
        src="/quote_template.png"
        width={width}
        height={height}
        alt="quote"
      />
      <span
        className={`absolute top-1/3 right-1/4 ${translate} text-white ${textSize} font-bold text-center`}
      >
        {quote}
      </span>
    </div>
  );
};
