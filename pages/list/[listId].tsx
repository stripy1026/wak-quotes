import { useRouter } from "next/router";

export default function ListId() {
  const router = useRouter();
  console.log("LISTID: ", router.query.listId);
  return (
    <>
      <h3>This is ListId page</h3>
    </>
  );
}
