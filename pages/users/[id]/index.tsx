import MobileLayout from "@components/mobile-layout";
import { useRouter } from "next/router";

const UserRetrieve = () => {
  const { query } = useRouter();
  const { name } = query;

  return (
    <MobileLayout seoTitle={(name as string) ?? "User Retrieve"}>
      <article>User retrieve</article>
    </MobileLayout>
  );
};

export default UserRetrieve;
