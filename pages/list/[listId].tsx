import { QuoteTemplate } from "@/components/QuoteTemplate";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

type ListIdProps = {
  quote: string;
};

export default function ListId({ quote }: ListIdProps) {
  const router = useRouter();
  return (
    <>
      <h3>This is ListId page</h3>
      <QuoteTemplate quote={quote} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(ctx.query.listId);
  return {
    props: { quote },
  };
};
