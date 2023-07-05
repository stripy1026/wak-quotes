import Head from "next/head";

type SeoType = {
  title: string;
  metaContent: string;
};

export const Seo = ({ title, metaContent }: SeoType) => {
  return (
    <Head>
      <title>{title} | Wak-Quotes</title>
      <meta name="description" content={metaContent} />
    </Head>
  );
};
