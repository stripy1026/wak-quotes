import { NextPage, NextPageContext } from "next";
import Image from "next/image";

type Props = {
  statusCode?: number;
};

const Error: NextPage<Props> = ({ statusCode }) => {
  return (
    <div className="my-5">
      <Image src="/no_signal.png" width={1239} height={698} alt="error" />
      <p className="text-center mb-5">응 재부팅하면 공짜야~</p>
      <p className="text-center">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
