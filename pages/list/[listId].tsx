import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function ListId() {
  const router = useRouter();
  return (
    <>
      <h3>This is ListId page</h3>
      <div>ID: {router.query.listId}</div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  console.log(ctx);
  return {
    props: {},
  };
};
