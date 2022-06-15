import { PublicLayout } from "@/app/common/layout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import Circle from "@/app/modules/Circle";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const CirclePage: NextPage = () => {
  const router = useRouter();
  const { circle: cId } = router.query;
  useQuery<Circle>(["circle", cId], () =>
    fetch(`http://localhost:3000/circles/slug/${cId as string}`).then((res) =>
      res.json()
    )
  );
  return (
    <>
      <MetaHead />
      <PublicLayout>
        <Circle />
      </PublicLayout>
    </>
  );
};

export default CirclePage;
